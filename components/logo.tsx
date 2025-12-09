import Image from "next/image";

export default function Logo() {
    return (
        <Image width={200} height={100} alt="logo" src={'/mayor.png'} className="w-[100%] h-[250px] object-cover -ml-3 -translate-y-27" />
    )
}