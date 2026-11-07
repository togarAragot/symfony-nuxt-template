<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__)
    ->exclude('var', 'vendor')
    ->notPath([
        'config/bundles.php',
        'config/reference.php',
    ])
;

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setLineEnding("\n")
    ->setRules([
        '@Symfony' => true,
        '@PHP8x4Migration' => true,
        'declare_strict_types' => true,
        'strict_param' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => true,
        'no_unused_imports' => true,
        'blank_line_after_opening_tag' => false,
        'trailing_comma_in_multiline' => [
            'elements' => ['arrays', 'arguments', 'parameters', 'match'],
        ],
        'yoda_style' => false,
        'single_quote' => true,
        'indentation_type' => true,
    ])
    ->setFinder($finder)
;
