import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { profiles } from "./users";
import { places } from "./places";

export const joinTypeEnum = pgEnum("join_type", ["open", "approval"]);
export const memberRoleEnum = pgEnum("member_role", ["owner", "admin", "member"]);
export const memberStatusEnum = pgEnum("member_status", ["active", "banned"]);
export const postTypeEnum = pgEnum("post_type", ["general", "notice", "review", "photo"]);
export const meetingParticipantStatusEnum = pgEnum("meeting_participant_status", ["joined", "cancelled"]);

export const clubs = pgTable("clubs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // hobby category
  region: text("region").notNull(),
  description: text("description").notNull(),
  ownerId: text("owner_id").references(() => profiles.id),
  coverImage: text("cover_image"),
  joinType: joinTypeEnum("join_type").default("open"),
  memberCount: integer("member_count").default(0),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clubMembers = pgTable("club_members", {
  clubId: text("club_id").references(() => clubs.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  role: memberRoleEnum("role").default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
  status: memberStatusEnum("status").default("active"),
});

export const clubPosts = pgTable("club_posts", {
  id: text("id").primaryKey(),
  clubId: text("club_id").references(() => clubs.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => profiles.id),
  type: postTypeEnum("type").default("general"),
  content: text("content").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clubPostLikes = pgTable("club_post_likes", {
  postId: text("post_id").references(() => clubPosts.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clubComments = pgTable("club_comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => clubPosts.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => profiles.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clubMeetings = pgTable("club_meetings", {
  id: text("id").primaryKey(),
  clubId: text("club_id").references(() => clubs.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),
  placeId: text("place_id").references(() => places.id), // 카카오맵 연동
  maxParticipants: integer("max_participants").default(20),
  currentCount: integer("current_count").default(0),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const meetingParticipants = pgTable("meeting_participants", {
  meetingId: text("meeting_id").references(() => clubMeetings.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  status: meetingParticipantStatusEnum("status").default("joined"),
  joinedAt: timestamp("joined_at").defaultNow(),
});
