## Project Overview

**ReLu** (Recommended Locations for U) is a virtual travel assistant that aspires to help ease the issue of overtourism. We believe a major cause for overtourism is that the rise in tourism is unequal - certain areas, landmarks and locations suffer overtourism while others in the same destination often receive no tourism at all.
This virtual assistant aims to ease this by encouraging users to alter their itinerary such that they avoid peak hours or overly crowded places as much as possible given their personal tolerance to crowds, travel habits, and preferences.

## Team Member Info:

- **Maika Nebgen** - Project manager and UI/UX, Waseda University
- **Minseon Kang** - Backend, Korea University
- **Omri Levin** - AI, Waseda University
- **Seungmin Lee** - Frontend, Yonsei University

## Resources and APIs

- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [Nager.date](https://date.nager.at/)
- [WeatherAPI](https://www.weatherapi.com/)
- [Firebase](https://firebase.google.com/) and [Firestore](https://firebase.google.com/docs/firestore)
- [Geocode](https://date.nager.at/)
- [node.js](https://nodejs.org/en)
- [React](https://react.dev/)

## AI usage

This project incorporates usage of AI provided by Gemini, currently using the 1.5 Flash model, and after the refined prompt and temperature setting hallucinated __under 10% of the time__ during the testing stage.
The prompt receives additional context continuously according to the received data by API calls and by manually-defined user preferences.
The sources of data for the AI are the user input, the core prompt, and the additional information received from the APIs and the model adapts accordingly.

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
