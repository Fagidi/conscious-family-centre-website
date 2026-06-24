import type { StructureResolver } from "sanity/structure";

/**
 * Studio desk — flat, task-oriented navigation for non-technical editors.
 * Top-level items mirror the website's pages so staff can find content
 * the same way visitors browse the site.
 */

const singleton = (S: Parameters<StructureResolver>[0], title: string, type: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conscious Family Centre")
    .items([
      singleton(S, "Homepage", "homePage"),
      singleton(S, "About Us", "aboutPage"),

      S.listItem()
        .title("Team Members")
        .child(S.documentTypeList("teamMember").title("Team Members")),

      S.divider(),

      S.listItem()
        .title("Programs")
        .child(
          S.list()
            .title("Programs")
            .items([
              singleton(S, "Page Layout & Text", "programsPage"),
              S.documentTypeListItem("program").title("All Programs"),
              S.documentTypeListItem("programCategory").title("Program Categories"),
            ]),
        ),

      S.listItem()
        .title("Summer Camp")
        .child(
          S.list()
            .title("Summer Camp")
            .items([
              S.documentTypeListItem("campSession").title("Camp Sessions"),
              S.documentTypeListItem("futureMakersRegistration").title("Camp Registrations"),
              S.documentTypeListItem("campRegistration").title("Past Registrations"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Gallery")
        .child(
          S.list()
            .title("Gallery")
            .items([
              singleton(S, "Page Layout & Text", "galleryPage"),
              S.documentTypeListItem("galleryItem").title("Photos"),
              S.documentTypeListItem("galleryCategory").title("Albums"),
              S.documentTypeListItem("featuredStory").title("Featured Stories"),
            ]),
        ),

      S.listItem()
        .title("Testimonials")
        .child(S.documentTypeList("testimonial").title("Testimonials")),

      S.divider(),

      S.listItem()
        .title("FAQ")
        .child(
          S.list()
            .title("Frequently Asked Questions")
            .items([
              singleton(S, "Page Layout & Text", "faqPage"),
              S.documentTypeListItem("faq").title("Questions & Answers"),
              S.documentTypeListItem("faqCategory").title("Question Categories"),
            ]),
        ),

      S.listItem()
        .title("News & Publications")
        .child(
          S.list()
            .title("News & Publications")
            .items([
              S.documentTypeListItem("post").title("Blog Posts"),
              S.documentTypeListItem("guide").title("Parent Guides"),
              S.documentTypeListItem("author").title("Authors"),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Contact Information")
        .child(
          S.list()
            .title("Contact Information")
            .items([
              singleton(S, "Page Layout & Text", "contactPage"),
              S.documentTypeListItem("contactMessage").title("Messages"),
              S.documentTypeListItem("inquiry").title("Inquiries"),
              S.documentTypeListItem("admissionEnquiry").title("Admission Enquiries"),
              S.documentTypeListItem("tourBooking").title("Tour Bookings"),
            ]),
        ),

      S.listItem()
        .title("Site Settings")
        .child(
          S.list()
            .title("Site Settings")
            .items([
              singleton(S, "General Settings", "siteSettings"),
              singleton(S, "Navigation Menus", "navigation"),
              S.documentTypeListItem("event").title("Term Dates & Events"),
              S.documentTypeListItem("policy").title("Policies"),
              S.documentTypeListItem("page").title("Custom Pages"),
              S.documentTypeListItem("subscriber").title("Newsletter Subscribers"),
            ]),
        ),
    ]);
