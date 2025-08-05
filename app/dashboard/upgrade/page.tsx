"use client";

import { createCheckOutSession } from "@/actions/createCheckOutSession";
import { createStripePortal } from "@/actions/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscription from "@/hooks/useSubscription";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type UserDetails = {
    email: string;
    name: string;
};

function PricingPage() {
    const { user } = useUser();
    const router = useRouter();
    const { hasActiveMembership, loading } = useSubscription();
    const [isPending, startTransition] = useTransition();

    const handleUpgrade = () => {
        if (!user) return;

        const userDetails: UserDetails = {
            email: user.primaryEmailAddress?.toString()!,
            name: user.fullName!,
        };

        startTransition(async () => {
            const stripe = await getStripe()

            if(hasActiveMembership) {
                //create stripe portal
                const stripePortalUrl = await createStripePortal();
                return router.push(stripePortalUrl);
            }

            const sessionId = await createCheckOutSession(userDetails);

            await stripe?.redirectToCheckout({
                sessionId
            })
        });
    };

  return (
    <div>
      <div className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Supercharge your document Companion
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that's packed with the best features for interacting with your PDFs, enhancing productivity,
          and streamlining your workflow.
        </p>

        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Starter Plan */}
          <div className="ring-1 ring-gray-200 p-8 rounded-3xl text-center flex flex-col justify-between">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore Core Features at No Cost
            </p>
            <p className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
              Free
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 text-left">
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                2 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 3 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Try out the AI Chat Functionality
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="ring-2 ring-indigo-600 rounded-3xl p-8 text-center flex flex-col justify-between">
            <h3 className="text-lg font-semibold leading-8 text-indigo-600">
              Pro Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
              $5.99 <span className="text-sm font-semibold text-gray-600">/ month</span>
            </p>

            <Button className="bg-indigo-600 w-full text-white shadow-sm hover:bg-indigo-500 mt-6 rounded-md px-3 py-2 
            text-sm font-semibold"
            disabled={loading || isPending}
            onClick={handleUpgrade}
            >
              {isPending || loading 
                ? "Loading..."
                : hasActiveMembership 
                ? "Manage subscription" 
                : "Upgrade to Pro"}
            </Button>

            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 text-left">
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Store up to 20 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Ability to delete Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 100 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Full power AI Chat functionality with Memory Recall
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Advanced analytics
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                24-hour support response time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
