# Google Books Preview Pages Downloader

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

Technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

## About this Project

This project is a simple Google Books Preview Pages Downloader. It uses the Google's APIs to download the preview pages of a book.

> **N.B**: You can never download the full book, only the preview pages. The preview pages are the pages that are available to preview for free on Google Books. This App is just a tool to try download those preview pages for offline reading. Please buy the book if you want the original full version.

## What's the catch?

Even with preview pages, Google limits the number of pages you can view given a particular IP address.

If you use a VPN like Proton VPN, you can change your IP and download preview pages that are made available to the new IP address that your VPN provides.

Due to this reason this app can download a few preview pages only that are available to the particular IP of the machine you are using. If you want to download more pages, you can try to use a VPN to change your IP address.

> It's tested and works to download about 80 pages of preview pages that was available to my IP address (from a 500 page book). This is a **major limitation** of this app.
> Future improvements can be made to add features that work with VPN to download more pages.

This project was created for learning purposes only. It's not meant to be used for any commercial purpose or for any illegal activity.
