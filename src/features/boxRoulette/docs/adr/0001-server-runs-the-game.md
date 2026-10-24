# The server runs the game

Every **Run**, whether a guest or a **Player** is playing, is played on the server. The browser only sends actions (start, pick a box, cash out), and the server decides the outcome and keeps the **Score**. Because no number ever comes from the browser, every run on a **Leaderboard** was really played. We first planned to trust scores reported by the browser and check that they were possible. That would have been simpler, but anyone with DevTools could post a fake run, and logging in only identifies who posted it.

The server rolls a **Round** when the pick arrives instead of hiding a layout in advance. The odds are the same, and the only state stored is the run's status, score and **Rounds survived**. The cost is a network round trip per pick and no offline play. Guest runs are stored without an owner, so a player who logs in afterwards can **Claim** the run they just finished. Bots can still grind for lucky runs, so starting runs stays rate-limited.
