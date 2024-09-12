import { Redirect } from "expo-router";
import React from "react";

const redirect = "/";

export default function NotFound() {
  return <Redirect href={redirect as any} />;
}
