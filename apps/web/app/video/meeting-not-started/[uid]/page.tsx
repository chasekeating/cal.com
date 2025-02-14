import { withAppDirSsr } from "app/WithAppDirSsr";
import type { PageProps as _PageProps } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { notFound } from "next/navigation";
import { z } from "zod";

import { BookingRepository } from "@calcom/lib/server/repository/booking";

import { getServerSideProps } from "@lib/video/meeting-not-started/[uid]/getServerSideProps";

import type { PageProps } from "~/videos/views/videos-meeting-not-started-single-view";
import MeetingNotStarted from "~/videos/views/videos-meeting-not-started-single-view";

const querySchema = z.object({
  uid: z.string(),
});

export const generateMetadata = async ({ params }: _PageProps) => {
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    notFound();
  }
  const booking = await BookingRepository.findBookingByUid({
    bookingUid: parsed.data.uid,
  });

  return await _generateMetadata(
    (t) => t("this_meeting_has_not_started_yet"),
    () => booking?.title ?? ""
  );
};

const getData = withAppDirSsr<PageProps>(getServerSideProps);

export default WithLayout({ getData, Page: MeetingNotStarted, getLayout: null })<"P">;
