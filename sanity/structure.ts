import type { StructureResolver } from "sanity/structure";

/**
 * Studio desk — task-oriented grouping that mirrors how staff work:
 * settings, the learning offer, the two conversion inboxes (camps &
 * admissions), proof assets, editorial content, and policies.
 */

const singleton = (S: Parameters<StructureResolver>[0], title: string, type: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conscious Family Centre")
    .items([
      // ── Settings ──
      singleton(S, "Home Page", "homePage"),
      singleton(S, "About Page", "aboutPage"),
      singleton(S, "Programs Page", "programsPage"),
      singleton(S, "Gallery Page", "galleryPage"),
      singleton(S, "FAQ Page", "faqPage"),
      singleton(S, "Contact Page", "contactPage"),
      singleton(S, "Site Settings", "siteSettings"),
      singleton(S, "Navigation", "navigation"),
      S.divider(),

      // ── Programs ──
      S.listItem()
        .title("Programs")
        .child(
          S.list()
            .title("Programs")
            .items([
              S.documentTypeListItem("program").title("Programs"),
              S.documentTypeListItem("programCategory").title("Categories"),
            ]),
        ),

      // ── Camps ──
      S.listItem()
        .title("Camps")
        .child(
          S.list()
            .title("Camps")
            .items([
              S.documentTypeListItem("campSession").title("Camp Sessions"),
              S.documentTypeListItem("futureMakersRegistration").title("Future Makers Registrations"),
              S.documentTypeListItem("campRegistration").title("Registrations (legacy)"),
            ]),
        ),

      // ── Admissions inbox ──
      S.listItem()
        .title("Admissions")
        .child(
          S.list()
            .title("Admissions")
            .items([
              S.documentTypeListItem("inquiry").title("Inquiries"),
              S.documentTypeListItem("admissionEnquiry").title("Admission Enquiries"),
              S.documentTypeListItem("tourBooking").title("Tour Bookings"),
              S.documentTypeListItem("event").title("Term Dates & Events"),
            ]),
        ),
      S.divider(),

      // ── People & proof ──
      S.listItem()
        .title("People & Proof")
        .child(
          S.list()
            .title("People & Proof")
            .items([
              S.documentTypeListItem("teamMember").title("Team"),
              S.documentTypeListItem("testimonial").title("Testimonials"),
              S.documentTypeListItem("galleryItem").title("Gallery"),
              S.documentTypeListItem("galleryCategory").title("Gallery Categories"),
              S.documentTypeListItem("featuredStory").title("Featured Stories"),
              S.documentTypeListItem("author").title("Authors"),
            ]),
        ),

      // ── Content ──
      S.listItem()
        .title("Content")
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("page").title("Pages"),
              S.documentTypeListItem("post").title("Blog"),
              S.documentTypeListItem("guide").title("Guides"),
              S.documentTypeListItem("faq").title("FAQ"),
              S.documentTypeListItem("faqCategory").title("FAQ Categories"),
              S.documentTypeListItem("contactMessage").title("Contact Messages"),
              S.documentTypeListItem("subscriber").title("Subscribers"),
            ]),
        ),

      // ── Policies ──
      S.documentTypeListItem("policy").title("Policies"),
    ]);
