---
title: Switching to Void Linux
author: Brian Ma
date: 2026-08-13
description: describing my switch from Arch Linux to Void Linux over the past month
---

About a month ago, I decided to switch from Arch Linux to Void Linux as my current daily driver. I had a few reasons for doing so, for a bit of context, I have been using Arch Linux for around two to three years. Arch Linux was probably my second or third distro that I tried out before settling on using it. I chose Arch for its main advantages, that being it was minimalistic, had a fast package manager, and was a rolling release distro which was great for using the latest updates from different applications and software.

However that last point was also probably why I switched to a different distro after two years. Arch's unique rolling release system allows it to be probably one of the fastest mainstream distros in releasing the latest software. In my opinion it's actually pretty good...most of the time.

## Arch's Rolling Release System

While it's nice to be able to frequently get new updates to all of the applications I use, most of the time these updates don't really change the way I use the application unless it's a major version release going from v0.2 to v0.3 or something changing how the software should be used. So most updates end up just being minor updates, bug fixes, or patches to the software, so why was this a problem for me...well _that_ was the exact problem for me.

Throughout my time using Arch, there would be moments where I would upgrade my system and unexpectedly something would break in some way. For example, I had a time where I was updating my system with a [blender](https://www.blender.org/download/) update, and I was like _ooh nice, a blender update_. I didn't realize anything out of the normal, but just a few weeks later I was using blender normally when suddenly I found out I couldn't export my 3D models to a [gltf](https://en.wikipedia.org/wiki/GlTF) file anymore. Turns out the update I made updated blender to a newer version, but didn't update a python dependency that blender needed to export my gltf models.

So I had an older version of this python dependency while blender required a newer version of it. This was a known issue while going through Arch forums so I assumed it would be fixed soon... That fix did not happen until months after the problem started, I ended up having to extract the tar file from the blender website and run blender off the pre-built binary as a workaround.

To be fair, this was nothing uncommon within the Arch ecosystem, a random package would break from time to time due to some dependency error, and would be fixed eventually. For this scenario, I wasn't all that bothered with blender breaking unexpectedly, this was just a minor inconvenience at most. In fact, I have had other occurrences as well where packages would suddenly break one day, one time when I was using [lmms](https://lmms.io/) and suddenly one of its built-in synthesizers stopped working (due to a dependency issue again). And another time when pulseaudio, my audio server, stopped working and my computer couldn't play sound (although that was probably just because pulseaudio was old and I just switched to pipewire instead). I didn't mind when a program broke sometimes, but what I did mind was how long it took for it to be fixed, and that for some reason could take months which was annoying.

But if something breaks, why don't you just fix it yourself?

I may have lots of time to use Arch and configure it for hours, but manually fixing packages and dependencies is beyond my expertise and interests.

## The AUR Incident

If you didn't know before, Arch has a separate unofficial repository called the Arch User Repository (AUR) maintained by the community. Using the AUR is great if a package you need isn't in the official repositories, chances are they can be found in the AUR.

Unfortunately, as mentioned before, the AUR is an unofficial repository maintained only by the community. This allows any person to contribute to any package without having any background checks or credibility, or at least this was how it worked before the AUR malware attacks.

About two months ago in June, the AUR suddenly faced a wave of hijack attacks, basically a bunch of packages and PKGBUILD scripts in the AUR had been hijacked with malicious code that could steal credentials or install rootkits if installed or updated. Roughly 1500 packages were infected, most of which are orphaned packages. This meant that the packages were maintained by no one and could be taken in by anyone from any background which was the method the hijackers used to affect 1500 packages in the AUR.

As a frequent user of AUR packages, this wasn't an ideal situation at the time.

## Switching Distros

So with the trouble of Arch's bleeding edge rolling release system and the AUR attack, it prompted me that right now would be a great time to reinstall since I also wanted to clear out my storage. I decided to switch to Void Linux since it basically has almost the same features as Arch, with the difference being that Void focuses more on a stable rolling release model rather than bleeding edge which for the most part fixes random apps breaking.

Why not use other distros such as Artix or NixOS.

Artix is just Arch but without [systemd](https://en.wikipedia.org/wiki/Systemd), it still uses the same package manager and repository as Arch so there would be little benefit in switching. As for NixOS, I actually use NixOS for homelabbing on another system. Its declarative nature allows for good configurability and reproducibility, but that also makes it not support [FHS](https://en.wikipedia.org/wiki/Filesystem_Hierarchy_Standard) which is what I prefer using for a daily driver.

## Void

For two months now I have been using Void Linux and the experience has been pretty solid. Installing Void was nothing as hard compared to installing Arch.

To begin with, Void uses a different init system, [runit](https://en.wikipedia.org/wiki/Runit), which is different from systemd, what Arch uses and also like 98% of all other distros use as well. For that matter, there's nothing different besides manually creating the symlinks for different services from one directory to another in order to enable them. Runit also follows unix philosophy more closely than systemd so I guess your system can also boot six seconds faster if you want that.

I don't care that much about the init system of a distro if there isn't a large interference with my daily work, however I get why some people would have a disfavorable view of systemd. To be honest, I have also had some unfavorable experience with systemd in the past. Sometimes systemd would stall my computer while rebooting or shutting down, and some of these times it can take up to 1-5 minutes! This was probably just a hardware/firmware issue and was only happening on one of computers so there wasn't anything to validate there.

One of the hardest parts of switching to Void was actually setting everything up after install. In the past, I have installed and set up Arch multiple times into the graphical environment so I thought setting up Void wouldn't be any different. I was proven wrong when in the graphical environment I found out one of my apps wasn't working properly when prompted from another app. Basically I was trying to click a url link in one program that would usually open the page on another browser program that was already open. But it wasn't working and the link never showed up on the browser. Turns out I didn't setup [dbus](https://en.wikipedia.org/wiki/D-Bus) properly and fixing dbus totally did not make me break a sweat.

Anyways, the rest of my experiences using Void were more smooth. The only bumps in the way were the times when I couldn't find a package on Void that I wanted to use. Void has a slightly smaller package repository than Arch so technically there is less software available in Void. Although to be fair, most packages I used from Arch that weren't in Void came from the AUR instead, so that wasn't really a massive downside for me.

Another thing I have come to like is Void's unique packaging system. Void uses xbps as its package manager which also includes xbps-src as a separate tool used to create your own packages as build scripts and compile them into packages for xbps to install. It's similar to how PKGBUILD scripts work in Arch with pacman. When I said before that I didn't like interacting with a distro's packaging system, I may have lied just a little bit.

Void's xbps-src ecosystem allows you to more easily create your own packages manually from source since it was designed that way from the beginning. Using xbps-src was an interesting experience as it gave me insights of how packaging systems worked within a distribution. I have even made my own packages as well such as a package for zen browser, and obsidian which weren't in the Void repos by default.

## Fin
So basically that's how I moved from Arch to Void Linux and its a suitable distro for the time being. With that said, I also want to mention that this doesn't mean I don't like Arch anymore or think Arch is worse. I think Arch is still a very good distro for those who like minimalistic, fast, and cutting-edge distros. Those features are what makes Arch one the most popular distros in Linux.

Will you ever use Arch Linux again in the future?

That depends on a multitude of reasons. I have no gripes against Arch and I'm perfectly fine with using Arch, all distros in the end are basically the same underlying Linux kernal and file systems with just slightly differing pre-installed software. The important part is more likely the hardware/firmware I use the distro on. I have had an unfavorable history of just one app breaking on one computer but working completely fine on another, so it's likely that the distro is usually not the fault in my case, just that I happened to switch distros under certain conditions during the right time.
