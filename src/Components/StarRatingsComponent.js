import React, { useEffect, useState } from "react";
import StarRating from "react-native-star-rating";
import { useSelector } from "react-redux";
import CPColors from "../Utils/CPColors";
import { RATING_POST } from "../Utils/CPConstant";
import { postApi } from "../Utils/ServiceManager";

const StarRatingsComponent = (props) => {
  const userSelector = useSelector((state) => state);
  const [selectedStar, setselectedStar] = useState(
    props.ratings[0]?.rating ?? 0
  );
  console.log("RATINGSprops::::", props);

  useEffect(() => {
    starRating(selectedStar);
  }, [selectedStar]);

  const starRating = (ratings) => {
    const param = {
      post_id: props.postId,
      rating: ratings,
      post_userid: props?.postUserId,
    };
    console.log("RATINGSparams::::", param);

    postApi(
      RATING_POST,
      param,
      onSuccessRatings,
      onFailureRatings,
      userSelector.userOperation
    );
  };

  const onSuccessRatings = (response) => {
    console.log("RATINGS::::", response);
    if (response.success) console.log("RATINGS SUCCESS ::::", response);
  };
  const onFailureRatings = (error) => {
    console.log(error, "RATINGS:::: error");
  };

  return (
    <StarRating
      maxStars={5}
      rating={selectedStar}
      starSize={15}
      starStyle={{ marginLeft: 5 }}
      fullStarColor={CPColors.starColor}
      halfStarColor={CPColors.starColor}
      emptyStarColor={CPColors.starColor}
      selectedStar={(value) => setselectedStar(value)}
    />
  );
};

export default StarRatingsComponent;
