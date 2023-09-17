<?php
defined('TYPO3') || die('Access denied.');

call_user_func(
    function()
    {
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTypoScript(
            'plate_atomic_assets',
            'setup',
            '@import "EXT:plate_atomic_assets/Configuration/TypoScript/setup.typoscript"'
        );
    }
);
