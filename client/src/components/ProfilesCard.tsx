import { SwipeCard } from "@/components/SwipeCard";
import type { ProfileCard } from "@/types/api";

type Props = {
  profiles: ProfileCard;
};

/** @deprecated Используйте SwipeCard */
const ProfilesCard = ({ profiles }: Props) => <SwipeCard card={profiles} />;

export default ProfilesCard;
