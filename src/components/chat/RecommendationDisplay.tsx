
import { CarRecommendationCard } from "./CarRecommendationCard";
import { PartRecommendationCard } from "./PartRecommendationCard";
import { CarProps } from "@/types/car";

interface PartProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  image_url: string | null;
  compatible_cars: string[] | null;
  seller: {
    username: string;
  };
}

interface RecommendationDisplayProps {
  type: 'cars' | 'parts';
  items: CarProps[] | PartProps[];
  title: string;
}

export function RecommendationDisplay({ type, items, title }: RecommendationDisplayProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-4">
      <h4 className="text-sm font-semibold mb-3 text-gray-700">{title}</h4>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {type === 'cars' ? (
          (items as CarProps[]).map((car) => (
            <CarRecommendationCard key={car.id} car={car} />
          ))
        ) : (
          (items as PartProps[]).map((part) => (
            <PartRecommendationCard key={part.id} part={part} />
          ))
        )}
      </div>
    </div>
  );
}
