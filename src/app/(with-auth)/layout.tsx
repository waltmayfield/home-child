import React from "react";
import WithAuth from "@/components/withAuth";
import "@aws-amplify/ui-react/styles.css";

export default function AuthRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAuth>
      {children}
    </WithAuth>
  );
}