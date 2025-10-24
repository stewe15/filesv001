"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { LinkPage } from "../pages/LinkPage/ui/LinkPage";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


const Page = () => {
    const params = useSearchParams();
    const filename = params.get("filename") || undefined;
    const secret = params.get("secret") || undefined;
    return(
        <LinkPage filename={filename} secret={secret} />
    )
}

export default function Home() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
        <Page />
    </Suspense>
  );
}
