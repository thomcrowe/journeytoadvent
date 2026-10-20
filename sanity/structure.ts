import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Journey to Advent')
    .items([
      S.listItem()
        .title('Seasons')
        .child(
          S.documentTypeList('season')
            .title('Seasons')
            .defaultOrdering([{ field: 'year', direction: 'desc' }])
            .child((seasonId) =>
              S.list()
                .title('Season')
                .items([
                  S.listItem().title('Season details').child(S.document().schemaType('season').documentId(seasonId)),
                  S.listItem()
                    .title('Weeks')
                    .child(
                      S.documentTypeList('week')
                        .title('Weeks')
                        .filter('_type == "week" && season._ref == $seasonId')
                        .params({ seasonId })
                        .defaultOrdering([{ field: 'number', direction: 'asc' }])
                        .initialValueTemplates([S.initialValueTemplateItem('week-in-season', { seasonId })])
                        .child((weekId) =>
                          S.documentTypeList('entry')
                            .title('Entries this week')
                            .filter('_type == "entry" && week._ref == $weekId')
                            .params({ weekId })
                            .defaultOrdering([{ field: 'date', direction: 'asc' }]),
                        ),
                    ),
                  S.listItem()
                    .title('All entries')
                    .child(
                      S.documentTypeList('entry')
                        .title('Entries by date')
                        .filter('_type == "entry" && season._ref == $seasonId')
                        .params({ seasonId })
                        .defaultOrdering([{ field: 'date', direction: 'asc' }]),
                    ),
                ]),
            ),
        ),
      S.divider(),
      S.documentTypeListItem('hymn').title('Hymns'),
      S.divider(),
      S.documentTypeListItem('emailLog').title('Email log'),
    ])
