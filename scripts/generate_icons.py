import zlib
import struct
import math
import os

def create_png(width, height, pixel_data):
    """
    Creates a valid PNG file from raw RGBA pixel data (list of (R, G, B, A) tuples).
    pixel_data length must be width * height.
    """
    # 1. PNG Signature
    png_sig = b'\x89PNG\r\n\x1a\n'

    # 2. IHDR Chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc

    # 3. IDAT Chunk (Raw scanlines with filter type 0)
    raw_scanlines = bytearray()
    for y in range(height):
        raw_scanlines.append(0) # Filter type 0 (None)
        row_start = y * width
        for x in range(width):
            r, g, b, a = pixel_data[row_start + x]
            raw_scanlines.extend((r, g, b, a))

    compressed_idat = zlib.compress(bytes(raw_scanlines), 9)
    idat_crc = struct.pack('>I', zlib.crc32(b'IDAT' + compressed_idat) & 0xffffffff)
    idat_chunk = struct.pack('>I', len(compressed_idat)) + b'IDAT' + compressed_idat + idat_crc

    # 4. IEND Chunk
    iend_data = b''
    iend_crc = struct.pack('>I', zlib.crc32(b'IEND' + iend_data) & 0xffffffff)
    iend_chunk = struct.pack('>I', len(iend_data)) + b'IEND' + iend_data + iend_crc

    return png_sig + ihdr_chunk + idat_chunk + iend_chunk


def render_app_icon(size):
    """
    Renders a stunning modern health/neuro app icon:
    - Rounded squircle iOS shape
    - High-end dark cyan to emerald luxury gradient
    - Glowing neural circuits and central DNA/brain nutrient core
    """
    pixels = []
    center = size / 2.0
    corner_radius = size * 0.22 # iOS squircle radius
    
    # Brain / Neuron nodes
    nodes = [
        # Left hemisphere
        (center - size * 0.16, center - size * 0.14),
        (center - size * 0.24, center),
        (center - size * 0.18, center + size * 0.15),
        (center - size * 0.08, center + size * 0.22),
        (center - size * 0.06, center - size * 0.22),
        # Center core
        (center, center - size * 0.10),
        (center, center + size * 0.05),
        # Right hemisphere
        (center + size * 0.16, center - size * 0.14),
        (center + size * 0.24, center),
        (center + size * 0.18, center + size * 0.15),
        (center + size * 0.08, center + size * 0.22),
        (center + size * 0.06, center - size * 0.22),
    ]

    edges = [
        (0, 1), (1, 2), (2, 3), (0, 4), (4, 5), (1, 5), (2, 6), (3, 6), (5, 6),
        (7, 8), (8, 9), (9, 10), (7, 11), (11, 5), (8, 5), (9, 6), (10, 6)
    ]

    for y in range(size):
        for x in range(size):
            # Check squircle bounds
            # Distance from rounded corners
            dx = max(0, abs(x - center) - (center - corner_radius))
            dy = max(0, abs(y - center) - (center - corner_radius))
            dist_corner = math.sqrt(dx*dx + dy*dy)
            
            if dist_corner > corner_radius:
                pixels.append((0, 0, 0, 0)) # Transparent
                continue

            # Anti-aliasing on border
            edge_alpha = 1.0
            if dist_corner > corner_radius - 1.5:
                edge_alpha = max(0.0, min(1.0, (corner_radius - dist_corner) / 1.5))

            # Base gradient: Deep Slate / Cyan / Emerald (#091e2b -> #043d38)
            norm_y = y / float(size)
            norm_x = x / float(size)
            
            # Subtle radial highlight at top
            rad_dist = math.sqrt((x - center * 0.8)**2 + (y - center * 0.5)**2) / size
            highlight = max(0.0, 1.0 - rad_dist * 1.5) * 0.35

            # Background colors
            bg_r = int(10 + (norm_y * 8) + (highlight * 40))
            bg_g = int(24 + (norm_y * 42) + (highlight * 80))
            bg_b = int(38 + (norm_x * 20) + (highlight * 70))

            # Subtle subtle outer border / ring
            if dist_corner > corner_radius - 2.5:
                border_strength = 0.4
                bg_r = int(bg_r * (1 - border_strength) + 34 * border_strength)
                bg_g = int(bg_g * (1 - border_strength) + 211 * border_strength)
                bg_b = int(bg_b * (1 - border_strength) + 238 * border_strength)

            # Draw glowing edges (lines between nodes)
            line_glow = 0.0
            for idx1, idx2 in edges:
                x1, y1 = nodes[idx1]
                x2, y2 = nodes[idx2]
                # Distance from point (x,y) to segment (x1,y1)-(x2,y2)
                line_len_sq = (x2 - x1)**2 + (y2 - y1)**2
                if line_len_sq == 0:
                    dist_to_line = math.sqrt((x - x1)**2 + (y - y1)**2)
                else:
                    t = max(0, min(1, ((x - x1)*(x2 - x1) + (y - y1)*(y2 - y1)) / line_len_sq))
                    proj_x = x1 + t * (x2 - x1)
                    proj_y = y1 + t * (y2 - y1)
                    dist_to_line = math.sqrt((x - proj_x)**2 + (y - proj_y)**2)
                
                # Glowing stroke
                stroke_width = size * 0.015
                glow_radius = size * 0.04
                if dist_to_line < glow_radius:
                    intensity = (1.0 - (dist_to_line / glow_radius)) ** 1.8
                    line_glow = max(line_glow, intensity * 0.85)

            # Draw nodes (circular nutrient molecules)
            node_intensity = 0.0
            for nx, ny in nodes:
                d_node = math.sqrt((x - nx)**2 + (y - ny)**2)
                node_rad = size * 0.038
                node_glow = size * 0.08
                if d_node < node_rad:
                    # Solid core with bright center
                    core_val = 1.0 - (d_node / node_rad) * 0.2
                    node_intensity = max(node_intensity, core_val)
                elif d_node < node_glow:
                    glow_val = (1.0 - (d_node / node_glow)) ** 2 * 0.6
                    node_intensity = max(node_intensity, glow_val)

            # Combine background with cyan/emerald neural lines & nodes
            final_r = bg_r
            final_g = bg_g
            final_b = bg_b

            if line_glow > 0:
                final_r = int(final_r * (1 - line_glow) + 14 * line_glow)
                final_g = int(final_g * (1 - line_glow) + 165 * line_glow)
                final_b = int(final_b * (1 - line_glow) + 233 * line_glow)

            if node_intensity > 0:
                # Emerald to bright white-cyan glow
                final_r = int(final_r * (1 - node_intensity) + 52 * node_intensity + highlight * 60)
                final_g = int(final_g * (1 - node_intensity) + 211 * node_intensity + highlight * 40)
                final_b = int(final_b * (1 - node_intensity) + 153 * node_intensity)
                if node_intensity > 0.8:
                    # Center flash
                    flash = (node_intensity - 0.8) / 0.2
                    final_r = min(255, int(final_r + flash * 180))
                    final_g = min(255, int(final_g + flash * 255))
                    final_b = min(255, int(final_b + flash * 255))

            alpha = int(255 * edge_alpha)
            pixels.append((min(255, max(0, final_r)), min(255, max(0, final_g)), min(255, max(0, final_b)), alpha))

    return create_png(size, size, pixels)


def main():
    os.makedirs('public', exist_ok=True)
    os.makedirs('docs', exist_ok=True)

    sizes = [
        (180, 'apple-touch-icon.png'),
        (192, 'pwa-192x192.png'),
        (512, 'pwa-512x512.png'),
        (32, 'favicon-32x32.png'),
        (16, 'favicon-16x16.png')
    ]

    for size, filename in sizes:
        print(f"Generating {filename} ({size}x{size})...")
        png_bytes = render_app_icon(size)
        
        # Save to public/
        with open(os.path.join('public', filename), 'wb') as f:
            f.write(png_bytes)
            
        # Save to docs/
        with open(os.path.join('docs', filename), 'wb') as f:
            f.write(png_bytes)

    print("All icons generated successfully!")

if __name__ == '__main__':
    main()
