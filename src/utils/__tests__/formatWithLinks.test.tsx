import { describe, it, expect } from 'vitest';
import { formatWithLinks } from '../formatWithLinks';

describe('formatWithLinks', () => {
  it('should return plain text when no URLs are present', () => {
    const result = formatWithLinks('This is just plain text');
    expect(result).toEqual(['This is just plain text']);
  });

  it('should convert single URL to clickable link', () => {
    const result = formatWithLinks('Visit https://nasa.gov for more info');
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('Visit ');
    expect(result[1]).toMatchObject({
      type: 'a',
      props: {
        href: 'https://nasa.gov',
        target: '_blank',
        rel: 'noopener noreferrer',
        children: 'https://nasa.gov'
      }
    });
    expect(result[2]).toBe(' for more info');
  });

  it('should handle multiple URLs in the same text', () => {
    const result = formatWithLinks('Check https://nasa.gov and https://spacex.com');
    expect(result).toHaveLength(5);
    expect(result[0]).toBe('Check ');
    expect(result[1]).toMatchObject({
      type: 'a',
      props: { href: 'https://nasa.gov' }
    });
    expect(result[2]).toBe(' and ');
    expect(result[3]).toMatchObject({
      type: 'a',
      props: { href: 'https://spacex.com' }
    });
    expect(result[4]).toBe('');
  });

  it('should handle URLs at the beginning of text', () => {
    const result = formatWithLinks('https://nasa.gov is awesome');
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('');
    expect(result[1]).toMatchObject({
      type: 'a',
      props: { href: 'https://nasa.gov' }
    });
    expect(result[2]).toBe(' is awesome');
  });

  it('should handle URLs at the end of text', () => {
    const result = formatWithLinks('Visit https://nasa.gov');
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('Visit ');
    expect(result[1]).toMatchObject({
      type: 'a',
      props: { href: 'https://nasa.gov' }
    });
    expect(result[2]).toBe('');
  });

  it('should handle both http and https URLs', () => {
    const result = formatWithLinks('Try http://example.com and https://secure.com');
    expect(result).toHaveLength(5);
    expect(result[1]).toMatchObject({
      type: 'a',
      props: { href: 'http://example.com' }
    });
    expect(result[3]).toMatchObject({
      type: 'a',
      props: { href: 'https://secure.com' }
    });
  });

  it('should handle empty string', () => {
    const result = formatWithLinks('');
    expect(result).toEqual(['']);
  });

  it('should handle string with only a URL', () => {
    const result = formatWithLinks('https://nasa.gov');
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('');
    expect(result[1]).toMatchObject({
      type: 'a',
      props: { href: 'https://nasa.gov' }
    });
    expect(result[2]).toBe('');
  });
});
