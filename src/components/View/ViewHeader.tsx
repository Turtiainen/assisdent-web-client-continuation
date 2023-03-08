import React from "react";

export const ViewHeader = ({heading}: {heading: string}) => {
  return (
    <header className={`w-full bg-white p-8 mb-4`}>
      <h1 className={`text-3xl text-ad-hero-title font-medium`}>{heading}</h1>
    </header>
  )
}
