import React, { useEffect, useMemo, useState } from "react";
import SingleFriend from "./SingleFriend";
import "./Friends.css";
import { useAuth } from "../utils/AuthContext";
import { useFriends } from "../utils/FriendsContext";
import { useApi } from "../utils/useApi";
import { normalizeUsers } from "../utils/Helpers";



const Friends = () => {
  
  const { user } = useAuth();
  const myId = user?.id;
  const { friendIds, loading, refreshFriends } = useFriends();
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState("");

 
 const apiSafe = useApi();

useEffect(() => {
  let cancelled = false;

  (async () => {
    const usersData = await apiSafe("/api/users");
    if (!usersData)
        return; 
    if (!cancelled)
        setProfiles(normalizeUsers(usersData));
  })();

  return () => {
    cancelled = true;
  };
}, [apiSafe]);



  useEffect(() => {
    if (myId)
        refreshFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const friendsForMe = useMemo(() => {
    if (!myId)
        return [];
    return profiles.filter((p) =>
      friendIds.some((id) => String(id) === String(p.id))
    );
  }, [profiles, friendIds, myId]);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q)
      return friendsForMe;

    return friendsForMe.filter((f) => {
      const name = String(f?.p_name || "").toLowerCase();
      return name.includes(q);
    });
  }, [friendsForMe, query]);

  if (!myId)
      return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div>
      <div>
        <input
        className="friendSearch"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search friends..."
        />
      </div>
    <div className="friendsList">
      {loading && friendsForMe.length === 0 ? (
        <div style={{ padding: 16 }}>Loading...</div>
      ) : filteredFriends.length === 0 ? (
        <div className="invitationText">
          {query.trim() ? "No matching friends." : "No friends found."}
        </div>
      ) : (
        filteredFriends.map((f) => (
          <SingleFriend key={f.id} {...f} f_name={f.p_name} />
        ))
      )}
    </div>
    </div>
  );
};

export default Friends;
