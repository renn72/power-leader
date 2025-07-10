"use client";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { GetCompetitionByUuid } from "~/lib/types";
import { cn } from "~/lib/utils";

import AddBlackoutUsers from "./add_blackout_users";
import DeleteAllEntries from "./delete_all_entries";
import Entry from "./entry";
import EntryForm from "./entry_form";

export const dynamic = "force-dynamic";

const Entries = ({
	competition,
	className,
}: {
	competition: GetCompetitionByUuid;
	className?: string;
}) => {
	console.log({ competition });

	return (
		<div
			className={cn(
				className,
				"flex w-full flex-col items-center gap-2 text-lg font-medium",
			)}
		>
			<Card className="w-full">
				<CardHeader>Entries {competition.entries?.length}</CardHeader>
				<CardContent>
					<div className="flex w-full flex-col gap-4">
						<div className="flex w-full justify-end gap-4">
							<EntryForm competition={competition} />
							<AddBlackoutUsers competition={competition} />
						</div>
						{competition.entries
							?.sort((a, b) =>
								(a.user?.name ?? "") > (b.user?.name ?? "") ? 1 : -1,
							)
							?.map((entry) => (
								<Entry key={entry.id} entry={entry} />
							))}
						<DeleteAllEntries compId={competition.id} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Entries;
