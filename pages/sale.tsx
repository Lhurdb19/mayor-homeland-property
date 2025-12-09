import Categories from "@/components/landing/Categories";

export const metadata = {
    title: "Sale Properties | Dream Land",
};

export default function SalePage() {
    return (
        <>
        <h2>Sales Properties</h2>
    <Categories initialType="sale" showModalButton={false} enablePagination={true} />
        </>
)
}
