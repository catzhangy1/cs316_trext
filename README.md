# ESFD - EaSy Flight Deals
#####Created at YHack, Fall 2015

*Addison Hu, Yale University '17* <br>
*Kai Si, UC Berkeley '17* <br>
*Jackson Chang, UC Berkeley '15* <br>
*Catherine Zhang, Duke University '16* <br>

**Purpose & Features** <br>
This hack attempts JetBlue's Hack 1. The goal is to introduce some fun features that would use various unique parts of the data: <br>

> 1. <b>"I'm feeling adventurous"</b> - This feature randomly selects a Getaway package from the database. It's great for users who enjoy not knowing what comes ahead!

> 2. <b>"General Search"</b> - We ended up not having time to do the front end. It's also very standard.

> 3. <b>"Subscribe"</b> - This feature puts the user on a mailing list, but it is adaptive to more
        specifications. The user may specify a list of fields, and whenever a new 
        Getaway deal is added, we check if the specifications are a match to the
        user. If so, we email them to check for new deals!

> 4. <b>"Fun Times"</b> - We were just having fun here :) It could be adapted as a good marketing 
        strategy though, just not in its current state.

> 5. <b>"Game" </b> - Test your geography in a fun matching game and unlock great flight deals!


> 6. <b>"Admin Panel" </b> - Allows an admin to put new Getaway deals into the DB. Also checks the
        subscribe list to see if anyone should be notified.

**Unfinished Portions** <br>

> 1. We didn't know how to interpret the advance_weeks field. If advance_weeks means
that we only post a certain row at (date - advance_week) time, then we can add a 
flag to hide unreleased rows. The ability to notify subscribers should still work
similarly.

> 2. We didn't complete the General Search portion of the front end. It wasn't our
top priority though, since General Search is too mundane for this cool website!

> 3. More bug-fixing and bad-case catching
# cs316_trext
