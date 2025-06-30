import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image src={"/svg/logo.svg"} alt="AI 토르" width={100} height={21} />
    </Link>
  );
};

export default Logo;
