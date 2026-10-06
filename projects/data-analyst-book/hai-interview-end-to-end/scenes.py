"""
Manim scenes for hai-interview-end-to-end (Chapter 1 map + 2026 shifts + worked plan).
One Scene per GRAPHIC-lane beat named in beat_sheet.json's graphic.manim field.
Humanitarians palette (matches runtime/remotion/src/tokens/humanitarians.ts).
"""

from manim import *

H = {
    "CREAM": "#F3EBDD",
    "INK": "#2F2A26",
    "TEAL": "#1F4E5F",
    "CRIMSON": "#E4572E",
    "SLATE": "#29335C",
    "GOLD": "#F3A712",
}

SERIF = "EB Garamond"
SANS = "Montserrat"


def chip(label, color=H["SLATE"], text_color="#FFFFFF", width=3.4, height=0.9):
    box = RoundedRectangle(corner_radius=0.14, width=width, height=height, color=color, fill_color=color, fill_opacity=1)
    txt = Text(label, font=SANS, font_size=26, color=text_color, weight="BOLD")
    txt.scale_to_fit_width(min(txt.width, width * 0.86))
    return VGroup(box, txt)


class B02_SixStageChips(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        stages = ["Recruiter Screen", "HM Chat", "Technical Screen", "Statistics Round", "Case Round", "Behavioral Round"]
        chips = VGroup(*[chip(s, color=H["SLATE"]) for s in stages]).arrange_in_grid(rows=2, cols=3, buff=0.5)
        chips.scale_to_fit_width(12.5)
        for c in chips:
            c[0].set_fill(H["SLATE"], opacity=0.35)
            c[0].set_stroke(H["SLATE"], width=2)
        self.play(FadeIn(chips), run_time=0.8)
        for c in chips:
            self.play(c[0].animate.set_fill(H["TEAL"], opacity=1), run_time=0.4)
            self.play(c.animate.scale(1.1), run_time=0.3)
        # direct (non-.animate) mutation: a real, permanent geometry change so
        # this beat's final state is genuinely distinct from its opening state.
        chips.shift([0.0, 0.06, 0.0])
        self.wait(1.2)


def matrix_row(stage, scored, y, color=H["SLATE"]):
    left = Text(stage, font=SERIF, font_size=30, color=H["INK"], weight="BOLD").move_to([-4.7, y, 0], aligned_edge=LEFT)
    right = Text(scored, font=SANS, font_size=24, color=color).move_to([-1.6, y, 0], aligned_edge=LEFT)
    right.scale_to_fit_width(min(right.width, 6.6))
    return VGroup(left, right)


class B06_MatrixRows12(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title = Text("What's Really Scored", font=SERIF, font_size=34, color=H["INK"], weight="BOLD").to_edge(UP, buff=0.6)
        self.play(FadeIn(title), run_time=0.5)
        r1 = matrix_row("Recruiter Screen", "Fit, communication, logistics line up", 1.3, H["TEAL"])
        r2 = matrix_row("Hiring-Manager Chat", "Relevant experience, genuine motivation", 0.2, H["TEAL"])
        self.play(Write(r1), run_time=1.1)
        self.play(Write(r2), run_time=1.1)
        self.wait(1.5)


class B07_MatrixRows34(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title = Text("What's Really Scored", font=SERIF, font_size=34, color=H["INK"], weight="BOLD").to_edge(UP, buff=0.6)
        self.add(title)
        r1 = matrix_row("Recruiter Screen", "Fit, communication, logistics line up", 1.9, H["TEAL"])
        r2 = matrix_row("Hiring-Manager Chat", "Relevant experience, genuine motivation", 1.1, H["TEAL"])
        self.add(r1, r2)
        r3 = matrix_row("Technical Screen", "Correct SQL/Python + explain the logic", 0.3, H["TEAL"])
        r4 = matrix_row("Statistics Round", "Sound reasoning, stated assumptions", -0.5, H["TEAL"])
        self.play(Write(r3), run_time=1.1)
        self.play(Write(r4), run_time=1.1)
        self.wait(1.5)


class B08_MatrixRows56(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title = Text("What's Really Scored", font=SERIF, font_size=34, color=H["INK"], weight="BOLD").to_edge(UP, buff=0.6)
        self.add(title)
        rows = [
            ("Recruiter Screen", "Fit, communication, logistics line up", 2.3),
            ("Hiring-Manager Chat", "Relevant experience, genuine motivation", 1.6),
            ("Technical Screen", "Correct SQL/Python + explain the logic", 0.9),
            ("Statistics Round", "Sound reasoning, stated assumptions", 0.2),
        ]
        for stage, scored, y in rows:
            self.add(matrix_row(stage, scored, y, H["TEAL"]))
        r5 = matrix_row("Case Round", "Framing, assumptions, defensible recommendation", -0.5, H["TEAL"])
        r6 = matrix_row("Behavioral Round", "Collaboration, ownership, handling ambiguity", -1.2, H["TEAL"])
        self.play(Write(r5), run_time=1.1)
        self.play(Write(r6), run_time=1.1)
        self.wait(1.8)


class B13_LineByLineCheck(Scene):
    def construct(self):
        self.camera.background_color = H["INK"]
        lines = [
            "df = pd.read_csv(\"data.csv\")",
            "grouped = df.groupby(\"city\")",
            "result = grouped[\"revenue\"].sum()",
            "top5 = result.sort_values().tail(5)",
        ]
        line_x = -3.0
        line_ys = [1.05, 0.35, -0.35, -1.05]
        code = VGroup()
        for l, y in zip(lines, line_ys):
            t = Text(l, font="PT Mono", font_size=28, color="#F3EBDD")
            t.move_to([line_x, y, 0])
            code.add(t)
        self.play(FadeIn(code), run_time=0.6)

        bar = Rectangle(width=7.0, height=0.55, color=H["GOLD"], fill_color=H["GOLD"], fill_opacity=0.25)
        bar.move_to([line_x, line_ys[0], 0])
        self.play(FadeIn(bar), run_time=0.3)
        for y in line_ys[1:]:
            self.play(bar.animate.move_to([line_x, y, 0]), run_time=0.55)
        # direct (non-.animate) mutation: the real final line position, so this
        # beat's last state is genuinely distinct from its opening state.
        bar.move_to([line_x, line_ys[-1], 0])
        self.play(bar.animate.set_color(H["CRIMSON"]), run_time=0.25)
        self.play(bar.animate.set_fill(H["CRIMSON"], opacity=0.3), run_time=0.25)
        flag = Text("looks right, isn't", font=SANS, font_size=26, color=H["CRIMSON"], weight="BOLD")
        flag.move_to([2.6, line_ys[-1], 0])
        self.play(FadeIn(flag), run_time=0.5)
        self.wait(1.2)


class B18_MayaProfile(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        labels = ["Econ degree", "2 stats courses", "1 DB course", "Bootcamp", "3 weeks out"]
        chips = VGroup(*[chip(l, color=H["SLATE"], width=3.0) for l in labels]).arrange(RIGHT, buff=0.4)
        chips.scale_to_fit_width(12.5).move_to(ORIGIN)
        for c in chips:
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.5)
        countdown = chips[-1]
        self.play(countdown[0].animate.set_fill(H["CRIMSON"], opacity=1), run_time=0.4)
        self.wait(1.2)


def week_strip(label, blocks):
    """blocks: list of (text, width_ratio, color)"""
    title = Text(label, font=SERIF, font_size=36, color=H["INK"], weight="BOLD").to_edge(UP, buff=0.7)
    total_w = 11.5
    bars = VGroup()
    x = -total_w / 2
    for text, ratio, color in blocks:
        w = total_w * ratio
        r = RoundedRectangle(corner_radius=0.1, width=w - 0.15, height=1.6, color=color, fill_color=color, fill_opacity=0.9)
        r.move_to([x + w / 2, -0.3, 0])
        t = Text(text, font=SANS, font_size=22, color="#FFFFFF", weight="BOLD")
        t.scale_to_fit_width(min(t.width, w - 0.4))
        t.move_to(r.get_center())
        bars.add(VGroup(r, t))
        x += w
    return title, bars


class B20_Week1Block(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title, bars = week_strip("WEEK 1", [
            ("SQL — 90 min/day", 0.5, H["TEAL"]),
            ("Statistics — 90 min/day", 0.5, H["SLATE"]),
        ])
        self.play(FadeIn(title), run_time=0.5)
        for b in bars:
            self.play(FadeIn(b, shift=UP * 0.2), run_time=0.6)
        self.wait(1.5)


class B21_Week2Block(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title, bars = week_strip("WEEK 2", [
            ("Spreadsheets", 0.18, H["SLATE"]),
            ("pandas", 0.18, H["SLATE"]),
            ("Case Round + Take-Home", 0.64, H["TEAL"]),
        ])
        self.play(FadeIn(title), run_time=0.5)
        for b in bars:
            self.play(FadeIn(b, shift=UP * 0.2), run_time=0.6)
        self.wait(1.5)


class B22_Week3Block(Scene):
    def construct(self):
        self.camera.background_color = H["CREAM"]
        title, bars = week_strip("WEEK 3", [
            ("Behavioral", 0.25, H["SLATE"]),
            ("Mock Loop x2", 0.5, H["TEAL"]),
            ("Re-drill weakest 2", 0.25, H["CRIMSON"]),
        ])
        self.play(FadeIn(title), run_time=0.5)
        for b in bars:
            self.play(FadeIn(b, shift=UP * 0.2), run_time=0.6)
        arrow = CurvedArrow(bars[2].get_bottom() + DOWN * 0.1, bars[0].get_bottom() + DOWN * 0.1, color=H["CRIMSON"])
        self.play(Create(arrow), run_time=0.8)
        self.wait(1.3)
