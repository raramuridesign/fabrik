Fabrik for J!4.x
================

This is a test version, not a complete working version of fabrik.

Work is in progress to get it al working.

Final version:
================

Working in J!4.x only, does not work on <J!4.

Package removed (did not work and was not supported anyway).

All version hacks (release) removed, to be reimplemented for >J!4 and <J!5; we start with the latest J!4 version.

All unused functions removed (yes, there are some).

Install: only install what we need. Do a real install of library files, not install and copy (this is called 'moving files').
For the upgrade from J!3 to J!4: Add an option to install / uninstall fabrik files only; leaving all fabrik tables as they are in the database.

Visualization removed, because most does not work well and there are much better alternatives.

No sample application and several links removed from home dashboard.

Backend adapted for Atum template, frontend adapted for Cassiopeia template.

Limited amount of plugins.

Default language is Enlish only, other language can be installed seperately.

Test version:
================

Temporary only the following will be used:
com_fabrik
plg_fabrik_element_field
plg_fabrik_element_internalid
plg_fabrik_element_jdate
plg_fabrik_system

The first goal is to be able to install in J!4, then creat a list with default internalid and jdate and then add a new field element
We do this in the backend only. Next step is the frontend.

If this works, then I will continue with more plugins.

Temporary all files contain a lot of comments that needs to be deleted after all is working.
I just keep it in for debugging purpose.

Build and Install:
================

The build tool should be working now.
Only plugins plg_fabrik_element_field, plg_fabrik_element_internalid, plg_fabrik_element_jdate and plg_fabrik_system should be installed

The build tool needs to be modified later, when all is working in J!4

For now I copied my installable fabrik.zip in the fabrik_build folder

Progress:
================

2022-07-04: 
Install is working, only temporary manually install mootools-core.js & mootools-more.js in media\system\js. 
I will change this later, so they are loaded by the WebAssetManager

A new list can be created and a new (field)element can be added. A list can be trashed and trash can be emptied.
A new list menu item can be created, but the frontend is not working yet (router error).

All other menu items (forms, groups, elements,...) are updated, but some may not yet work as expected.

Only the status filter is working, other filters are not working yet.

