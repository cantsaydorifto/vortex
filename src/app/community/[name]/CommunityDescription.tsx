"use client";
import JoinCommunityButton from "./JoinCommunityButton";
import styles from "./CommunityDescription.module.css";

export default function CommunityDescription({ community }: Props) {
  return (
    <>
      <div className={styles.desc}>
        <div>
          <img src={community.icon} alt={community.name} />
          <span>
            {community.name[0].toUpperCase() + community.name.slice(1)}
          </span>
        </div>
        <JoinCommunityButton hidden={false} id={community.id} />
      </div>
      <p>{community.description} </p>
    </>
  );
}

type Props = {
  community: {
    id: number;
    name: string;
    description: string;
    icon: string;
  };
};
