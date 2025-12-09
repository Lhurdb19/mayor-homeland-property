import Categories from "@/components/landing/Categories";


export const metadata = {
  title: "Lease Properties | Dream Land",
};

export default function LeasePage() {
      return <Categories initialType="lease" showModalButton={false} enablePagination={true} />;
}
