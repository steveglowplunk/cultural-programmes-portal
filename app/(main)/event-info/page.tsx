"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const EventInfo = () => {
  const Map = useMemo(() => dynamic(
    () => import('@/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return (
    <>
      <div className="h-[600px]">
        <Map posix={[22.285056, 114.222075]} posix2={[22.44152, 114.02289]} />
      </div>
    </>
  )
}

export default EventInfo