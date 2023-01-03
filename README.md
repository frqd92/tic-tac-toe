# tic-tac-toe

Even though my code is still a bit messy and confusing, I felt like this project boosted my code structuring skills tenfold with the help of the last lesson on factory functions & the module pattern.

In my last project (Library), I naively declared so many unnecessary global variables, functions were not where they were supposed to be, and there were blocks and blocks of repeated code that could have been easily simplified.

Having said that, I'm not happy with how I handled the interaction between the Human, AI(random) and minimaxed AI. I wanted the game to be fully flexible, where users can change player type mid-game and it won't mess up turns. It kind of works, bugs out sometimes, however the code is a sea of if and else statements, there had to be a better way of doing that. The main problem was how the AI had to be triggered from the menu buttons and not the squares like the human player. Needed better planning fromm the start.