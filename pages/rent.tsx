import Categories from "@/components/landing/Categories";

export const metadata = {
  title: "Rent Properties | Dream Land",
};

export default function RentPage() {
      return <Categories initialType="rent" showModalButton={false} enablePagination={true}/>;
}
