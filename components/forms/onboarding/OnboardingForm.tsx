"use client";

import Image from "next/image";
import Logo from "@/public/logo.png"
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import UserTypeSelection from "./UserTypeForm";

type UserSelectionType = "company" | "jobSeeker" | null;

export function OnboardingForm() {
    const [step, setStep] = useState(1);
    const [userSelection, setUserSelection] = useState<UserSelectionType>(null); // mempengaruhi type

    function handleUserTypeSelection(type: UserSelectionType) {
        setUserSelection(type);
        setStep(2);
    }

    function renderStep() {
        switch (step) {
            case 1:
                return (
                    <UserTypeSelection />
                )
            case 2:
                return (
                    userSelection === "company" ? (
                        <p>User is a company</p>
                    ) : (
                        <p>User is a job seeker</p>
                    )
                );
            default:
                return null;
        }
    }

    return (
        <>
          <div className="flex items-center gap-3 mb-10">
            <Image src={Logo} alt="JobMarshal Logo" width={50} height={50} />
            <span className="text-4xl font-bold">
              Talent<span className="text-primary">Flow</span>
            </span>
          </div>
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">{renderStep()}</CardContent>
          </Card>
        </>
    );
}