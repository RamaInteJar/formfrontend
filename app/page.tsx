"use client";

import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import FacultyForm from "@/components/FacultyForm";
import { useAuth } from "@/providers/authProvider";
import LoginPage from "./auth/page";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      redirect("/auth");
    }
  }, [accessToken]);
  return accessToken ? <FacultyForm /> : <LoginPage />;
}
