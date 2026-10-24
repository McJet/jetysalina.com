# Box Roulette

A push-your-luck game: each round the player picks one of four boxes, and one of them is empty. Logged-in players compare their results on leaderboards.

**Box** values and outcomes are decided by the server, never by the browser.

## Language

**Player**:
Someone with a site account, playing Box Roulette. Only a Player's runs appear on **Leaderboards**.
_Avoid_: User (that is the site-wide account)

**Display name**:
The name a **Player** chooses to be shown under on **Leaderboards**, required before any of their runs are recorded. Unique across all players, ignoring case (`Jet` and `jet` are the same name). Never taken from the login provider. A player may change it, and the old name is free for anyone straight away.
_Avoid_: Username, initials, real name

**Run**:
One play-through, from starting the game until it ends in a **Cash out**, a **Bust** or **Abandoned**. Every run is played and kept by the server. A **Player's** runs are theirs, whichever way they ended. A guest's run has no owner, and is discarded soon after it ends unless it is **Claimed**.
_Avoid_: Game (ambiguous with the app itself), session, attempt

**Guest**:
Someone playing without logging in. Their runs count on no **Leaderboard** unless they log in and **Claim** them.

**Claim**:
A **Player** taking ownership of the finished guest **Runs** played on the same device, by logging in (or choosing a **Display name**) within about a day of playing them. All of that device's claimable runs are claimed at once, including any another person played there as a guest.

**Open run**:
A **Run** that has started and not yet ended. A player has at most one; coming back to the game resumes it.

**Abandoned**:
How an **Open run** ends when its player starts a new run instead of finishing it. Abandoned runs are kept but appear on no **Leaderboard**.
_Avoid_: Quit, forfeit

**Round**:
One pick among four boxes within a **Run**.

**Box**:
One of the four choices in a **Round**. Three hold points; one is empty.

**Score**:
The points a **Run** has accumulated across its **Rounds**. A **Bust** keeps the score it had at the moment of busting; the run is still a loss.
_Avoid_: Points (that is what a single box holds)

**Rounds survived**:
How many **Rounds** of a **Run** the player picked a box with points in. A **Cash out** after three good picks and a **Bust** on the fourth pick both have 3 rounds survived.
_Avoid_: Rounds, round number (the code's `roundNumber` counts differently per outcome)

**Cash out**:
The player choosing to end a **Run** and keep its **Score**.

**Bust**:
A **Run** ending because the player picked the empty **Box**.
_Avoid_: Lose, lost (the code's `lost` phase means a bust)

**First box bust**:
A **Bust** with 0 **Rounds survived**.

**Largest bust**:
The **Bust** with the highest **Score**: the most a player had and lost.

**Leaderboard**:
A ranked list of recorded **Runs**. Each kind of leaderboard ranks by a different measure: highest **Score**, most **Rounds survived**, **Largest bust**, **First box busts**.

**Global leaderboard**:
The **Leaderboard** of runs from every **Player**.

**Personal leaderboard**:
The **Leaderboard** of one **Player's** own runs, from any device.
_Avoid_: Local leaderboard (the old device-only board, which no longer exists)

## Relationships

- A **Run** has one or more **Rounds** and ends in exactly one of **Cash out**, **Bust** or **Abandoned**
- A **First box bust** is a kind of **Bust**
- A **Player's** cashed-out or busted **Run** appears on both the **Global** and that player's **Personal leaderboard**
- Only a finished, unowned guest **Run** can be **Claimed**, and only once
- A **Player** has exactly one **Display name**; changing it changes how all their past runs are shown
- The same **Player** may appear on the **Global leaderboard** more than once
- Someone logged in without a **Display name** plays as a **Guest**; choosing a name **Claims** the runs they finished
- A **Run** counts as the **Player's** if they are logged in when it finishes, even if they logged in partway through; a guest run finished before logging in becomes theirs only by **Claim**
- Deleting an account deletes the **Player's** runs; they leave every **Leaderboard**
