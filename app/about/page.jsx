"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function About() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    // console.log(session.token);
    return (
      <>
        Signed in as {session.token.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
