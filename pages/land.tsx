import Categories from "@/components/landing/Categories";


export const metadata = {
  title: "Land Properties | Dream Land",
};

export default function LandPage() {
  return (
    <div>
  <Categories initialType="land" showModalButton={false} enablePagination={true}/>
    </div>

)
}
