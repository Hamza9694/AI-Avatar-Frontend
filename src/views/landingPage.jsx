import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebouncedFunction } from "../hooks/debounceFunction.hook";

import { getData } from "../utils/helper";
import { API_ROUTES } from "../utils/apiRoutes";

import LandingPageHero from "../components/landingPage-hero.component";
import LandingPageChat from "../components/landingpage-chat.component";

const LandingPage = (props) => {
  const [selectedTag, setSelectedTag] = useState("");
  const { onClickSsExpanded, isExpanded } = props;

  const chatRef = useRef(null);

  const debouncedGetData = useDebouncedFunction(
    (route, queryParam = {}, params) => getData(route, queryParam, params),
  500
  );
  const { data, refetch } = useQuery({
    queryFn: () => {
      return debouncedGetData(API_ROUTES.GET_THREAD_ID, {}, {});
    },
    queryKey: ["GET_THREAD_ID"],
    staleTime: 0,
    enabled: false,
    gcTime: 0,
  });

  useEffect(() => {
    if (selectedTag && chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedTag, isExpanded]);

  useEffect(() => {
    const threadId = sessionStorage.getItem("THREAD_ID");

    if (!threadId || threadId === "") {
      refetch();
    }

    if (!threadId && data && data.Thread_ID) {
      sessionStorage.setItem("THREAD_ID", data.Thread_ID);
    }
  }, [data]);

  return (
    <div className="landing-page-hero-wrapper">
      {!isExpanded ? (
        <LandingPageHero
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      ) : null}
      <div ref={chatRef}>
        <LandingPageChat
          selectedTag={selectedTag}
          isExpanded={isExpanded}
          onClickSsExpanded={onClickSsExpanded}
        />
      </div>
    </div>
  );
};

export default LandingPage;
