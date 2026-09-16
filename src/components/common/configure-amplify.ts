"use client";

import { Amplify } from "aws-amplify";

import { amplifyConfig } from "@/lib/amplify-config";

Amplify.configure(amplifyConfig, { ssr: true });

export function ConfigureAmplify(): null {
  return null;
}
