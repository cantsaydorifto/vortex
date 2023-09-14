"use client";

import styles from "./userPage.module.css";

type Props = {
  username: string;
  userId: number;
  joiningDate: Date;
  userProfilePic: string;
  userLikes: number[];
  userDislikes: number[];
  followers: number;
  following: {
    Community: {
      id: number;
      name: string;
      icon: string;
    };
  }[];
};

export default function UserInfoContainer({ userInfo }: { userInfo: Props }) {
  return (
    <div className={styles.userContainer}>
      <span>
        <img src={userInfo.userProfilePic} alt={userInfo.username} />
        <span>
          {userInfo.username[0].toUpperCase() + userInfo.username.slice(1)}
        </span>
        <button className={styles.joinCommunityButton}>Follow</button>
      </span>
      <div className={styles.follow}>
        <p>
          <span>{userInfo.followers}</span> Followers
        </p>
        <p>
          <span>{userInfo.following.length}</span> Following
        </p>
      </div>
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/591/591607.png"
          alt=""
        />
        Joined {month(userInfo.joiningDate.getMonth())}{" "}
        {userInfo.joiningDate.getFullYear()}
      </div>
    </div>
  );
}

function month(month: number) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month];
}
