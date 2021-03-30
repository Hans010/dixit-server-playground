
let story = '';

export const submitStory = (newStory) => {
    story = newStory;
    console.log('roundController got a new story', story);
}