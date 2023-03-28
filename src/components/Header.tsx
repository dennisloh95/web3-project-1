"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import WalletConnect from "./WalletConnect";
import daysjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { CardContainer } from "./CardContainer";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Button } from "./Button";
import Link from "next/link";
import { nav } from "./Sidebar";

daysjs.extend(advancedFormat);

const dateDesktop = daysjs().format("ddd, Do MMM YYYY h:mm A Z");
const dateMobile = daysjs().format("ddd, Do MMM YY");

function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}

const Header = () => {
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [dateTime] = useState({
    desktop: dateDesktop,
    mobile: dateMobile,
  });

  const handleMobileNavClick = useCallback(
    (e: MouseEvent) => {
      assertIsNode(e.target);
      if (!mobileNavRef.current?.contains(e.target) && toggleDrawer) {
        setToggleDrawer(false);
      }
    },
    [toggleDrawer]
  );

  useEffect(() => {
    document.addEventListener("click", handleMobileNavClick);
    return () => {
      document.removeEventListener("click", handleMobileNavClick);
    };
  }, [handleMobileNavClick]);

  return (
    <CardContainer className="flex md:flex-row mb-8 h-14 gap-6 justify-between items-center">
      <div className="text-sm font-medium text-slate-500">
        <span className="hidden md:block">{dateTime.desktop}</span>
        <span className="md:hidden">{dateTime.mobile}</span>
      </div>
      <div className="md:block hidden">
        <WalletConnect />
      </div>
      <div className="md:hidden">
        <Button className="text-lg" onClick={() => setToggleDrawer(true)}>
          <GiHamburgerMenu />
        </Button>
        <div
          ref={mobileNavRef}
          className={`absolute top-0 right-0 left-0 bg-white z-10 shadow-lg p-4 ${
            !toggleDrawer
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          } transition-all duration-700`}
        >
          <div className="flex flex-col">
            <Button
              variant={"ghost"}
              className="text-lg h-12 w-12 ml-auto"
              onClick={() => setToggleDrawer(false)}
            >
              <GrClose />
            </Button>
            <div className="flex flex-col justify-center items-center gap-3 mb-5">
              {nav.map(({ title, url, icons }) => (
                <Link
                  key={title}
                  href={url}
                  className={`w-full flex items-center p-3 rounded-md border hover:shadow-lg hover:shadow-slate-500/30 hover:border-0 ${
                    url === pathname
                      ? "bg-slate-900 text-white"
                      : " border border-slate-500/30"
                  }`}
                >
                  <span className="text-lg mr-3">{icons}</span>
                  <span className="text-sm font-medium">{title}</span>
                </Link>
              ))}
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default Header;
