# 12-Week Workout

A mobile-friendly 12-week workout tracker with **Beginner**, **Intermediate**, and **Advanced** plans. It records the weight loaded on **one side** of the bar or machine.

The app opens directly on the workout tracker. It groups supersets using the original workbook boundaries, with green marking the start and red marking the end. It also provides structured after-workout abs and stretching sessions and a guided 20-minute HIIT timer for Monday and Friday.

## Publish with GitHub Pages

1. Sign in to [GitHub](https://github.com) and create a new repository, for example `kb-12-week-workout`.
2. Open the repository and choose **Add file → Upload files**.
3. Extract this ZIP, then upload all of the files inside the `KB_12_Week_Workout_GitHub` folder to the repository root.
4. Commit the uploaded files to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the `main` branch and `/ (root)`, then click **Save**.

After GitHub finishes publishing, the site will be available at:

`https://YOUR-USERNAME.github.io/kb-12-week-workout/`

GitHub may take a few minutes to publish the first version.

## Editing the app

- `data.js` contains the Advanced V3 schedule, exercises, sets, and reps.
- `data-v1.js` contains the Beginner V1 schedule and plan definitions.
- `data-v2.js` contains the Intermediate V2 schedule and its workbook-defined supersets.
- `guides.js` contains the corrected exercise demonstrations and instructions.
- `workout-structure.js` contains the workbook-derived exercise grouping and BEFORE/AFTER sessions.
- `styles.css` controls the appearance.
- `guide-styles.css` contains styling for the corrected guide pages.
- `structure-styles.css` contains styling for grouped exercises, accessory sessions, and the HIIT timer.
- `app.js` controls plan switching, saving weights, previous-weight labels, week selection, and exercise pages.
- `index.html` is the page structure.

After editing a file on GitHub, commit the change. GitHub Pages will publish the update automatically.

## Important notes

- Enter the weight loaded on **one side only**.
- Weights remain in that browser using local storage. They are not synced between devices, so someone using the GitHub link on another phone cannot change your saved data.
- Moving from another hosted copy to the GitHub Pages URL starts a separate set of saved weights.
- Exercise demonstrations require an internet connection because their information and images load from the public Free Exercise DB project.
