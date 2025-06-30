// Test stub for transformMediaMetadata
import { transformMediaMetadata } from '../transformMediaMetadata';
describe('transformMediaMetadata', () => {
  it('should be defined', () => {
    expect(transformMediaMetadata).toBeDefined();
  });
  it('should map raw NASA metadata to MediaMetadata object', () => {
    const raw = {
      'AVAIL:Title': 'Test Title',
      'AVAIL:Description': 'Test Description https://nasa.gov',
      'AVAIL:DateCreated': '2020-01-01',
      'AVAIL:Keywords': ['space', 'nasa'],
      'AVAIL:SecondaryCreator': 'Jane Doe',
      'AVAIL:Center': 'JPL',
      'AVAIL:MediaType': 'image',
      'Composite:ImageSize': '1024x768',
      'File:FileSize': '1MB',
      'Photoshop:CopyrightFlag': true,
    };
    const result = transformMediaMetadata(raw, 'id1');
    expect(result).toEqual({
      id: 'id1',
      title: 'Test Title',
      description: 'Test Description https://nasa.gov',
      dateCreated: '2020-01-01',
      keywords: ['space', 'nasa'],
      creator: 'Jane Doe',
      center: 'JPL',
      mediaType: 'image',
      imageSize: '1024x768',
      fileSize: '1MB',
      copyright: 'Yes',
      sourceUrl: 'https://nasa.gov',
    });
  });
  it('should fallback to Description508 and Creator if needed', () => {
    const raw = {
      'AVAIL:Description508': 'Desc508',
      'AVAIL:Creator': 'John Doe',
      'Photoshop:CopyrightFlag': false,
    };
    const result = transformMediaMetadata(raw, 'id2');
    expect(result.description).toBe('Desc508');
    expect(result.creator).toBe('John Doe');
    expect(result.copyright).toBe('No');
  });
  it('should handle missing optional fields', () => {
    const raw = {};
    const result = transformMediaMetadata(raw, 'id3');
    expect(result.id).toBe('id3');
    expect(result.copyright).toBe('No');
  });
});
