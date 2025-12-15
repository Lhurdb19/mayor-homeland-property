import Image from "next/image";

export default function Logo() {
    return (
        <div className="w-70 md:w-100 md:overflow-hidden h-13 pl-4">

        <Image width={500} height={200} alt="logo" src={'/mayo.png'} className="w-90 overflow-hidden object-cover -ml-29 -translate-y-14" />
        </div>
    )
}