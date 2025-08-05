"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckOutSession(userDetails: UserDetails) {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("User not found");
    }

    //stripe listen --forward-to localhost:3000/webhook

    //first check if the user already has a StripeCustomerId
    let stripeCustomerId;

    const user = await adminDb.collection("users").doc(userId).get();
    stripeCustomerId = user.data()?.stripeCustomerId;   

    if (!stripeCustomerId) {
        //create a new stripe customer
        const customer = await stripe.customers.create({
            email: userDetails.email,
            name: userDetails.name,
            metadata: {
                userId,
            },
        });
        
        await adminDb.collection("users").doc(userId).set({
            stripeCustomerId: customer.id,
        });

        stripeCustomerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: "price_1RkM4oKyGirYPMII0zNvRgsS",
                quantity: 1,
            },
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
        cancel_url: `${getBaseUrl()}/upgrade,`
    });

    return session.id;
}