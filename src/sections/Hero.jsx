import React, { useEffect, useState } from 'react'
import { Canvas } from "@react-three/fiber"
import Printer from "../components/Printer.jsx"

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from "react"
import CanvasLoader from "../components/CanvasLoader"


const Hero = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset; // Current scroll position from the top
        const docHeight = document.documentElement.scrollHeight; // Total height of the document
        const winHeight = window.innerHeight; // Height of the viewport

        // Calculate the total scrollable distance
        const totalScrollableDistance = docHeight - winHeight;

        // Calculate the scroll percentage
        const percentage = (scrollTop / totalScrollableDistance) * 100;

        setScrollPercentage(percentage);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []); // Empty dependency array ensures it runs only once on mount/unmount

  return (
    <section className='min-h-screen w-full flex flex-col relative h-[2000px]'>

        <div className='w-full h-full absolute top-0'>
            <Canvas>
                <Suspense fallback={CanvasLoader}>
                    <PerspectiveCamera makeDefault position={[0, 0, 100]}/>
                    <Printer scale={.5} position={[0, -10, 0]} rotation={[.6, Math.floor(scrollPercentage) / 100, 0]}/>
                    <ambientLight intensity={2}/>
                    <directionalLight position={[10, 10, 10]} intensity={0.5}/>
                </Suspense>
            </Canvas>
        </div>
    </section>
    
  )
}

export default Hero