# 1.2.12

## New Features

* Repeat with parent
* Upgrade to Electron 17
* Upgrade to Google APIs 99

# 1.2.11

## New Features

* Upgrade to Electron 16
* Upgrade to Google APIs 92

## Bug Fixes

* Fix confirm on exit (#255)

# 1.2.10

## New Features

* Upgrade to Electron 14
* Upgrade to Google APIs 85

# 1.2.9

## New Features

* Improve calendar agenda view

# 1.2.8

## New Features

* Improve calendar week list view

# 1.2.7

## New Features

* Upgrade to Electron 13
* Checkbox to show/hide completed tasks in calendar

# 1.2.6

## New Features

* Improve calendar week list view
* Show completed tasks in calendar

# 1.2.5

## New Features

* Upgrade to Electron 12
* Upgrade to Google APIs 71

## Bug Fixes

* Fix condition tree updates

# 1.2.4

## New Features

* Open the date picker automatically when editing a date field

## Bug Fixes

* Fix task template date fields when "number of days from now" is zero (#226)
* Fix gap between task bar and status bar (#232)
* Fix logging of moment objects with electron log
* Fix initial synchronization with Toodledo

# 1.2.3

## New Features

* Set "today" as start date and/or due date with quick add task (#228)
* Open the task edition window from the reminder window

## Bug Fixes

* Fix task template date fields when "number of days from now" is zero (#226)

# 1.2.2

## New Features

* Upgrade to Electron 10
* Quick sort by clicking on a column header (#185)
* Set priority and status in "task quick add" bar (#216)

## Bug Fixes

* Fix double click on column header (#208)
* Refresh selection when an object is deleted (#209)

# 1.2.1

## New Features

* Improve synchronization performance
* Add setting to only synchronize tasks completed less than X months ago

# 1.2.0

## New Features

* Add week list calendar view (#115)
* Improve "Quick Add Task" action (#129)
* Add setting to customize postpone menu items (#130)
* Set data folder location via an environment variable (TASKUNIFIER_DATA_FOLDER) (#196)
* New logging and debug tool

## Bug Fixes

* Fix auto updater download progress

# 1.1.1

## Bug Fixes

* Improve synchronization performance
* Fix clear extended date picker
* Fix batch edit tasks

# 1.1.0

## New Features

* Improved auto updater
* Show badge count with number of reminded tasks
* Add setting to use system tray instead of task bar (#169)

## Bug Fixes

* Fix false positive trojan alert in Windows uninstaller

# 1.0.1

## New Features

* Add snooze and snooze all in reminder manager (#179)

## Bug Fixes

* Fix wrong first day of week (#167)
* Fix synchronization of sub-tasks with Toodledo (#177)
* Fix refresh form values (#180)

# 1.0.0

## New Features

* Add settings to synchronize/publish on startup/close
* Search in titles and notes instead of only titles
* Add new custom fields to the end of the table (#20)
* Open repeat dialog with "enter" key (#105)
* Change the way task reminders are dismissed (#165)
* Show system notifications for reminders (#168)

## Bug Fixes

* Trim tags imported from Toodledo
* Fix auto update on Windows
* Fix settings default values
* Task data not refreshed in edition window (#171)

# 0.9.7

## New Features

* Publish task calendar events to Google Calendar (#142)

# 0.9.6

## New Features

* Print only notes and tasks matching the selected filter
* Show "repeat from" icon in repeat column
* Show tooltip for task checkbox filters
* Publish task calendar events to Google Calendar (#142)
* Introduce custom scheme
* Add note quick add field
* Improve style of condition tree

## Bug Fixes

* Fix "yearly" repeat value
* Apply template from selected note filter

# 0.9.5

## Bug Fixes

* Fix synchronization with Toodledo and TaskUnifier

# 0.9.4

## New Features

* Show badge counts for every filter (#44)
* Undo/redo feature for notes and tasks (#112)
* Show work log events in calendar (#114)
* Code sign Windows binaries

## Bug Fixes

* Hide archived folders and goals in note/task sider
* Shrink long filter names (#150)

# 0.9.3

## New Features

* Show "total until now" in work log tab
* Move custom filters to the general directory (#100)
* Restore last used filter on startup (#110)
* Import/export data (#119)
* Show next save/backup/synchronization date (#121)
* Combine filters (#122)
* Add line between rows in task table (#127)
* Improve "Add sub-task" action (#134)
* Synchronize note/task filters and task templates with TaskUnifier Cloud
* Show general note filter info
* Compress backup files (#9)

## Bug Fixes

* Improve synchronization speed (#123)
* Refresh filter after update (#135)
* Fix initial synchronization of sub-tasks

# 0.9.2

## New Features

* Add work log tab
* Add status bar settings
* Add "Add sub-task" action
* Add shortcuts in date picker
* Add custom protocol handler
* Add "Show future tasks" filter
* Improved batch add and edit tasks dialog
* Show total elapsed time for today in status bar (#116)
* Allow search in select fields

## Bug Fixes

* Fix display bugs in note and task tables (#50) (#52)
* Fix date format in fields
* Fix Toodledo task completion date
* Fix usage of default task template

# 0.9.1

## New Features

* Activate using TaskUnifier Cloud Pro account
* Add status bar
* Add "Move out of parent task" action
* Show general task filter info
* Change note/task selection with arrow keys (#80)
* Reduce height of menu items (#95)
* Change default sort order (#97)
* Improve duration format (#98)
* Auto scroll to added note/task (#99)
* Improve icons color when a note/task is selected (#106)
* New setting to open the task edition window when a task is added

## Bug Fixes

* Fix comparison of dates and numbers
* Fix note field in task edition window (#94)
* Fix identification of markdown format (#104)
* Fix filtering of empty values (#107)

# 0.9.0

## New Features

* Improved batch add tasks dialog
* Show/hide task indentation (#74)
* Auto focus title when category is added (#89)
* Use selected filter when searching for text (#77)
* Save and restore opened menu items (#88)
* Escape clears search value (#78)
* Set selected category to added task (#79)
* Improve sort order of default filters (#84)
* New keyboard shortcuts (#6)

## Bug Fixes

* Clear batch add/edit tasks dialog on success (#91)
* Fix descending order of subtasks
* Fix skip repeat if no next date
* Fix computed repeat date
* Fix load stripe with proxy
* Fix invalid backup folder name
* Fix print booleans (#82)
* Fix quick add task selection (#81)
* Fix filter by completed field (#85)

# 0.8.2

## New Features

* Setting to select first day of the week
* Improve error reporting

## Bug Fixes

* Fix Toodledo start & due date timezone synchronization
* Fix create backup folder on Windows
* Fix skip restore backup settings
* Fix note format (use html instead of markdown)

# 0.8.1

## New Features

* Drag and drop multiple tasks at once
* Search task/note is now case insensitive
* Improved help (guided tour)
* Include parent tasks when a child matches a filter

## Bug Fixes

* Fix synchronization of tasks (only first 1000 tasks were retrieved)
* Fix synchronization of sub-tasks
* Keep note format when synchronizing with Toodledo

# 0.8.0

## New Features

* Improve file menu
* Improve toolbar layout
* Change default window size

## Bug Fixes

* Fix check new version

# 0.7.1

## New Features

* Add search input in condition tree add menu
* Display version in settings

## Bug Fixes

* Fix column reordering
* Set completion date
* Fix add linked files
* Synchronization license check

# 0.7.0

## New Features

* Improve synchronization with Toodledo
* Trial license

## Bug Fixes

* Fix help button
* Fix default column order

# 0.6.0-beta

## New Features

* Improve synchronization with Toodledo
* Synchronization with TaskUnifier Cloud
* Add synchronization options in settings
* New repeat field

# 0.5.0-beta

## New Features

* Add rich text editor for notes
* Note custom field manager

## Bug Fixes

* Skip save to server when nothing to update
* Rename note fields to text field to match server

# 0.4.0-beta

# 0.3.0-beta

# 0.2.0-alpha

# 0.1.0-alpha