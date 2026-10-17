"""scenes.py — Manim scenes for banking-domain-interview-end-to-end-v2 (cli-explainer).
5 output beats (B01, B02, B05, B08, B09) — the Manim slots in the 12-beat spine;
the other 7 beats (B00, B03, B04, B06, B07, B10, B11) render via Remotion.
Claude-skin-adjacent palette: cream ground, warm ink, one terracotta brand accent,
plus a functional teal/crimson pair — here used as a five-step interpolated
gradient (current → charge-off) rather than a binary right/wrong contrast, since
none of this reel's worked examples are shown as buggy (see FACTCHECK.md).
Class names are `B0X_Name(Scene)` — required for run.sh's scene-detection regex.
No LaTeX (Text/Pango only). Render each class to manim/<bid>.mp4, then run.sh compiles.

DUR values below are the estimated_duration_s from beat_sheet.json (audio not yet
generated at Gate 3 — see PLAN.md's gate order). Per duration-planner doctrine,
these are provisional pacing targets, not the final clock: once
generate_audio_kokoro.py locks actual_duration_s, reconcile DUR here to match
before the final render (regenerate/recompile, never hand-trim the rendered mp4).
"""
from manim import *
import numpy as np

CREAM = "#FAF9F5"; INK = "#3D3929"; TERRACOTTA = "#D97757"
TEAL = "#1F6F5C"; CRIMSON = "#BF3339"; SEC = "#6B6357"


def checkmark(color=TEAL, size=0.32):
    """A real vector checkmark (native shape) instead of a Unicode glyph in a
    Text mobject — Gate A's distinctness stub excludes Text from its shape
    signature, so a glyph-as-check reads as 'no shape ever changes'."""
    mark = VMobject(color=color, stroke_width=7)
    mark.set_points_as_corners([
        np.array([-0.5, 0.05, 0]) * size,
        np.array([-0.1, -0.45, 0]) * size,
        np.array([0.55, 0.5, 0]) * size,
    ])
    return mark


def wrap(text, n):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 <= n:
            cur = (cur + " " + w).strip()
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def pad(scene, elapsed, target):
    scene.wait(max(0.4, target - elapsed - 0.2))


class B01_TheSecondLanguage(Scene):
    """PROBLEM beat — the gap: SQL/Python are already solid; banking adds a layer on top."""
    DUR = 26.69

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        head = Text("You already know this.", color=INK, weight="BOLD",
                     font_size=38).to_edge(UP, buff=0.7)
        self.play(Write(head), run_time=1.1); elapsed += 1.1

        sql = RoundedRectangle(corner_radius=0.12, width=3.0, height=1.1, color=TEAL,
                                stroke_width=4, fill_color=CREAM, fill_opacity=1).move_to([-2.2, 1.0, 0])
        py = RoundedRectangle(corner_radius=0.12, width=3.0, height=1.1, color=TEAL,
                               stroke_width=4, fill_color=CREAM, fill_opacity=1).move_to([2.2, 1.0, 0])
        sql_txt = Text("SQL", color=INK, weight="BOLD", font_size=34).move_to(sql.get_center())
        py_txt = Text("Python", color=INK, weight="BOLD", font_size=34).move_to(py.get_center())
        self.play(FadeIn(sql, shift=RIGHT * 0.4), FadeIn(py, shift=LEFT * 0.4), run_time=0.8)
        self.play(FadeIn(sql_txt), FadeIn(py_txt), run_time=0.4)
        elapsed += 1.2

        lock = Text("solid", color=SEC, font_size=22, slant="ITALIC").next_to(
            VGroup(sql, py), DOWN, buff=0.3)
        self.play(FadeIn(lock, shift=UP * 0.1), run_time=0.6); elapsed += 0.6

        chips_text = ["OCC", "CFPB", "CET1", "LCR", "charge-off"]
        chips = VGroup()
        for i, t in enumerate(chips_text):
            chip = RoundedRectangle(corner_radius=0.35, width=2.15, height=0.75,
                                     color=TERRACOTTA, stroke_width=3,
                                     fill_color=TERRACOTTA, fill_opacity=0.0)
            ctxt = Text(t, color=TERRACOTTA, weight="BOLD", font_size=24)
            ctxt.move_to(chip.get_center())
            chips.add(VGroup(chip, ctxt))
        chips.arrange(RIGHT, buff=0.3).move_to([0, -0.6, 0])

        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 1.6) for c in chips],
                              lag_ratio=0.15, run_time=1.6)); elapsed += 1.6
        self.play(*[c[0].animate.set_fill(opacity=0.14) for c in chips], run_time=0.5)
        elapsed += 0.5

        layer_label = Text("the layer banking adds", color=TERRACOTTA, weight="BOLD",
                            font_size=26).next_to(chips, DOWN, buff=0.5)
        self.play(FadeIn(layer_label, shift=UP * 0.1), run_time=0.7); elapsed += 0.7

        closer = Text(wrap("Miss it, and “technically perfect” still reads as "
                            "“never worked in banking.”", 56),
                      color=INK, weight="BOLD", font_size=27, line_spacing=1.1,
                      ).to_edge(DOWN, buff=0.7)
        self.play(Write(closer), run_time=1.8); elapsed += 1.8

        pad(self, elapsed, self.DUR)


class B02_SixPartMap(Scene):
    """MECHANISM beat — the book's own six-part map, built as one pipeline."""
    DUR = 19.41

    PARTS = [
        ("I", "Landscape"),
        ("II", "Regulation\n& Risk"),
        ("III", "Data\nStack"),
        ("IV", "Technical\nPrep"),
        ("V", "Behavioral\n& Case"),
        ("VI", "Day-Of"),
    ]

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        head = Text("Six parts.", color=INK, weight="BOLD",
                     font_size=36).to_edge(UP, buff=0.65)
        self.play(Write(head), run_time=0.9); elapsed += 0.9

        boxes = VGroup()
        for numeral, label in self.PARTS:
            box = RoundedRectangle(corner_radius=0.1, width=1.95, height=1.55,
                                    color=TEAL, stroke_width=3.5,
                                    fill_color=CREAM, fill_opacity=1)
            num = Text(numeral, color=TERRACOTTA, weight="BOLD", font_size=22)
            lbl = Text(label, color=INK, font_size=17, line_spacing=1.0)
            num.move_to(box.get_top() + DOWN * 0.35)
            lbl.move_to(box.get_center() + DOWN * 0.12)
            boxes.add(VGroup(box, num, lbl))
        boxes.arrange(RIGHT, buff=0.28).scale(0.98).move_to([0, 0.2, 0])

        arrows = VGroup(*[
            Arrow(boxes[i].get_right(), boxes[i + 1].get_left(), buff=0.05,
                  color=SEC, stroke_width=3, max_tip_length_to_length_ratio=0.35)
            for i in range(len(boxes) - 1)
        ])

        for i, b in enumerate(boxes):
            self.play(FadeIn(b, shift=UP * 0.2), run_time=0.55)
            elapsed += 0.55
            if i > 0:
                self.play(Create(arrows[i - 1]), run_time=0.15)
                elapsed += 0.15

        self.play(Indicate(boxes, color=TERRACOTTA, scale_factor=1.03), run_time=0.9)
        elapsed += 0.9

        tag = Text("one gap, mapped end to end", color=SEC, font_size=24,
                    slant="ITALIC").next_to(boxes, DOWN, buff=0.6)
        self.play(FadeIn(tag, shift=UP * 0.1), run_time=0.7); elapsed += 0.7

        pad(self, elapsed, self.DUR)


def _balance_table(rows, value_color, badge_text, badge_color):
    """Shared 3-row (month, balance) table builder for B05 — mirrors the sibling
    reel's helper, minus the wrong/right pairing since this beat has no bug."""
    header = VGroup(
        Text("Month", color=SEC, font_size=26, weight="BOLD").move_to([-2.0, 2.2, 0]),
        Text("EOM Balance", color=SEC, font_size=26, weight="BOLD").move_to([2.0, 2.2, 0]),
    )
    rule = Line([-4.2, 1.75, 0], [4.2, 1.75, 0], color=SEC, stroke_width=2)
    row_group = VGroup()
    ys = [0.9, 0.0, -0.9]
    for (month, value), y in zip(rows, ys):
        m = Text(month, color=INK, font_size=28).move_to([-2.0, y, 0])
        v = Text(value, color=value_color, weight="BOLD", font_size=32).move_to([2.0, y, 0])
        row_group.add(VGroup(m, v))
    badge = RoundedRectangle(corner_radius=0.15, width=7.4, height=0.85, color=badge_color,
                              stroke_width=3, fill_color=badge_color, fill_opacity=0.12)
    badge.move_to([0, -2.3, 0])
    badge_txt = Text(badge_text, color=badge_color, weight="BOLD", font_size=22).move_to(badge.get_center())
    return header, rule, row_group, badge, badge_txt


class B05_CorrectBalance(Scene):
    """OUTPUT beat, cycle 1 — the correct running-balance result (no bug to contrast)."""
    DUR = 17.3

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        title = Text("ACCT-50231 — end-of-month balance", color=INK, weight="BOLD",
                      font_size=30).to_edge(UP, buff=0.6)
        self.play(Write(title), run_time=1.1); elapsed += 1.1

        header, rule, rows, badge, badge_txt = _balance_table(
            [("Jan 2026", "$12,100.00"), ("Feb 2026", "$12,250.00"), ("Mar 2026", "$12,175.00")],
            TEAL, "SAW THE WHOLE LEDGER FIRST", TEAL)

        self.play(FadeIn(header), run_time=0.4); elapsed += 0.4
        self.play(Create(rule), run_time=0.4); elapsed += 0.4
        self.play(LaggedStart(*[FadeIn(r, shift=UP * 0.15) for r in rows],
                              lag_ratio=0.6, run_time=1.8)); elapsed += 1.8

        note = Text(wrap("Jan's balance still carries the Nov 2025 deposit", 40),
                     color=SEC, font_size=18, slant="ITALIC",
                     line_spacing=1.0).next_to(rows, DOWN, buff=0.2)
        self.play(FadeIn(note, shift=UP * 0.1), run_time=0.7); elapsed += 0.7

        self.play(FadeIn(badge), FadeIn(badge_txt), run_time=0.5); elapsed += 0.5
        self.play(Indicate(VGroup(badge, badge_txt), color=TEAL, scale_factor=1.05), run_time=0.8)
        elapsed += 0.8

        pad(self, elapsed, self.DUR)


class B08_VintageCurve(Scene):
    """OUTPUT beat, cycle 2 — the cohort result (Harborline Card Co.)."""
    DUR = 19.78

    MONTHS = ["3 mo", "6 mo", "9 mo"]
    BUCKETS = ["current", "30", "60", "90+", "charge_off"]
    # (current, 30, 60, 90+, charge_off) per months-on-book column — VISUAL-PLAN.md
    COUNTS = {
        "3 mo": [460, 30, 8, 2, 0],
        "6 mo": [420, 40, 25, 10, 5],
        "9 mo": [390, 45, 30, 20, 15],
    }
    TOTAL = 500

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        title = Text("Harborline Card Co. — Jan 2025 cohort", color=INK, weight="BOLD",
                      font_size=36).to_edge(UP, buff=0.65)
        self.play(Write(title), run_time=1.0); elapsed += 1.0

        bucket_colors = [interpolate_color(ManimColor(TEAL), ManimColor(CRIMSON),
                                            i / (len(self.BUCKETS) - 1))
                          for i in range(len(self.BUCKETS))]

        bar_h_max = 3.4
        bar_w = 2.3
        xs = [-4.2, 0.0, 4.2]
        base_y = -1.15

        col_groups = VGroup()
        n_labels = VGroup()
        for x, month in zip(xs, self.MONTHS):
            counts = self.COUNTS[month]
            segs = VGroup()
            y = base_y
            for count, color in zip(counts, bucket_colors):
                h = bar_h_max * (count / self.TOTAL)
                if h <= 0:
                    continue
                seg = Rectangle(width=bar_w, height=h, color=color, stroke_width=1,
                                 fill_color=color, fill_opacity=0.92)
                seg.move_to([x, y + h / 2, 0])
                segs.add(seg)
                y += h
            outline = Rectangle(width=bar_w, height=bar_h_max, color=SEC, stroke_width=2,
                                 fill_opacity=0).move_to([x, base_y + bar_h_max / 2, 0])
            lbl = Text(month, color=INK, weight="BOLD", font_size=30).next_to(outline, DOWN, buff=0.25)
            n_lbl = Text(f"n={self.TOTAL}", color=SEC, font_size=22).next_to(outline, UP, buff=0.15)
            col_groups.add(VGroup(outline, segs))
            n_labels.add(VGroup(lbl, n_lbl))

        for (outline, segs), (lbl, n_lbl) in zip(col_groups, n_labels):
            self.play(Create(outline), FadeIn(lbl), FadeIn(n_lbl), run_time=0.4)
            elapsed += 0.4
            self.play(LaggedStart(*[FadeIn(s, shift=UP * 0.1) for s in segs],
                                  lag_ratio=0.35, run_time=1.6))
            elapsed += 1.6

        month_labels = VGroup(*[nl[0] for nl in n_labels])

        tag = Text("the cohort total never changes — only the mix does", color=SEC,
                    font_size=26, slant="ITALIC").next_to(month_labels, DOWN, buff=0.3)
        self.play(FadeIn(tag), run_time=0.7); elapsed += 0.7

        legend = VGroup(*[
            VGroup(Square(side_length=0.32, fill_color=c, fill_opacity=0.92, stroke_width=0),
                   Text(b, color=SEC, font_size=24)).arrange(RIGHT, buff=0.16)
            for b, c in zip(self.BUCKETS, bucket_colors)
        ]).arrange(RIGHT, buff=0.55).next_to(tag, DOWN, buff=0.3)
        self.play(FadeIn(legend, shift=UP * 0.1), run_time=0.8); elapsed += 0.8

        pad(self, elapsed, self.DUR)


class B09_TwoMoves(Scene):
    """SUMMARY beat — the lesson, one beat, plus the six-part map compressed beneath."""
    DUR = 17.69

    def construct(self):
        self.camera.background_color = CREAM
        elapsed = 0.0

        head = Text("Two moves.", color=INK, weight="BOLD", font_size=58)
        head.to_edge(UP, buff=0.65).to_edge(LEFT, buff=0.85)
        rule = Rectangle(width=2.8, height=0.1, color=TERRACOTTA, fill_color=TERRACOTTA,
                          fill_opacity=1, stroke_width=0).next_to(head, DOWN, buff=0.3, aligned_edge=LEFT)
        self.play(Write(head), run_time=0.8); elapsed += 0.8
        self.play(GrowFromEdge(rule, LEFT), run_time=0.35); elapsed += 0.35

        items = ["Get the SQL evaluation order right", "Never lose the cohort"]
        rows = VGroup()
        for it in items:
            check = checkmark(size=0.62)
            txt = Text(it, color=INK, font_size=48)
            row = VGroup(check, txt).arrange(RIGHT, buff=0.4, aligned_edge=UP)
            rows.add(row)
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.5).next_to(rule, DOWN, buff=0.55, aligned_edge=LEFT)
        self.play(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.25) for r in rows],
                              lag_ratio=0.6, run_time=1.6)); elapsed += 1.6

        rest_label = Text("the rest of the book →", color=SEC, font_size=32,
                           slant="ITALIC").next_to(rows, DOWN, buff=0.5, aligned_edge=LEFT)
        self.play(FadeIn(rest_label, shift=UP * 0.1), run_time=0.6); elapsed += 0.6

        def make_chip(label):
            chip = RoundedRectangle(corner_radius=0.28, width=len(label) * 0.2 + 0.75, height=0.78,
                                     color=TEAL, stroke_width=3, fill_color=CREAM, fill_opacity=1)
            ctxt = Text(label, color=INK, font_size=23)
            ctxt.move_to(chip.get_center())
            return VGroup(chip, ctxt)

        chip_row1 = VGroup(*[make_chip(l) for l in ["Regulation", "Data Stack"]]).arrange(RIGHT, buff=0.5)
        chip_row2 = VGroup(*[make_chip(l) for l in ["Behavioral & Case", "Day-Of"]]).arrange(RIGHT, buff=0.5)
        chips = VGroup(chip_row1, chip_row2).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        chips.next_to(rest_label, DOWN, buff=0.4, aligned_edge=LEFT)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.15) for c in (*chip_row1, *chip_row2)],
                              lag_ratio=0.2, run_time=1.4)); elapsed += 1.4

        pad(self, elapsed, self.DUR)
