function mungeResponse(reviewData) {
    const formattedResponse = reviewData.businesses.map(reviewItem => {
        return {
            yelp_id: reviewItem.id,
            name: reviewItem.name,
            image_url: reviewItem.image_url,
            rating: reviewItem.rating,
            url: reviewItem.url,
        };
    });
    return formattedResponse;
}

module.exports = { mungeResponse };