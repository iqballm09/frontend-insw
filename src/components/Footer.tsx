import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import moment from "moment";

const Footer = () => {
  return (
    <div className="border-t py-4">
      <MaxWidthWrapper className="flex items-center justify-center">
        Copyright ©{moment().year()} All Right Reserved
        <div className="border-l pl-3 ml-3">
          Indonesia National Single Window <br />
          In Collaboration with{" "}
          <Image
            className="inline"
            alt="..."
            src={"/jaga-logo.png"}
            width={40}
            height={40}
          />
          <br />
          Versi 1.0.0
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
