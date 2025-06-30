// Test stub for transformMediaItem
import { transformMediaItem } from '../transformMediaItem';
describe('transformMediaItem', () => {
  it('should be defined', () => {
    expect(transformMediaItem).toBeDefined();
  });
  it('should transform raw NASA items into MediaItem objects', () => {
    const input = [
      {
        data: [
          {
            nasa_id: 'id1',
            title: 'Title 1',
            description: 'Desc',
            date_created: '2020-01-01',
            media_type: 'image',
            keywords: ['nasa', 'space'],
          },
        ],
        links: [
          { href: 'https://example.com/thumb1.jpg' },
        ],
      },
    ];
    const result = transformMediaItem(input);
    expect(result).toEqual([
      {
        id: 'id1',
        title: 'Title 1',
        description: 'Desc',
        dateCreated: '2020-01-01',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        mediaType: 'image',
        keywords: ['nasa', 'space'],
      },
    ]);
  });
  it('should use placeholder thumbnail if no links', () => {
    const input = [
      {
        data: [
          {
            nasa_id: 'id2',
            title: 'Title 2',
            description: 'Desc2',
            date_created: '2021-01-01',
            media_type: 'video',
            keywords: [],
          },
        ],
      },
    ];
    const result = transformMediaItem(input);
    expect(result[0].thumbnailUrl).toContain('svs.gsfc.nasa.gov');
  });
  it('should filter out items without data', () => {
    const input = [
      { data: [] },
      {},
    ];
    expect(transformMediaItem(input)).toEqual([]);
  });
});
